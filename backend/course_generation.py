import io
import PyPDF2
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import os
from google import genai
import json
import uuid
import shutil
from backend.database import get_db
from backend.models import Course, Lesson, Question, User
from backend.auth import get_current_active_user
from pydantic import BaseModel
from backend.video_processing import transcode_video, transcribe_video_audio, upload_to_s3, generate_presigned_url

router = APIRouter()

# Read the API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Initialize the GenAI client using the new SDK
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from a PDF file."""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

async def process_video_securely(file: UploadFile, content: bytes) -> dict:
    """
    Saves the video to disk temporarily, transcodes it, uploads it to S3,
    and transcribes the audio securely using local Whisper.
    Returns the transcription and the generated S3 signed URL.
    """
    temp_id = str(uuid.uuid4())
    original_path = f"/tmp/{temp_id}_original_{file.filename}"
    transcoded_path = f"/tmp/{temp_id}_optimized.mp4"

    # Save to disk
    with open(original_path, "wb") as f:
        f.write(content)

    try:
        # Transcode video to standard MP4
        print(f"Transcoding video: {original_path}...")
        success = transcode_video(original_path, transcoded_path)
        final_video_path = transcoded_path if success else original_path

        # Upload to S3 (Securely)
        print("Uploading to secure S3 bucket...")
        object_key = upload_to_s3(final_video_path)
        # Store the object_key instead of the expiring URL

        # Transcribe Audio using local Whisper
        print("Transcribing audio locally with Faster-Whisper...")
        transcription = transcribe_video_audio(final_video_path)

        return {
            "text": transcription,
            "video_url": object_key
        }

    finally:
        # Cleanup temp files
        if os.path.exists(original_path):
            os.remove(original_path)
        if os.path.exists(transcoded_path):
            os.remove(transcoded_path)

async def process_file(file: UploadFile, content: bytes) -> dict:
    """Process a single file and return its extracted text and potential media URL."""
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        return {"text": extract_text_from_pdf(content), "video_url": None}
    elif filename.endswith(".txt") or filename.endswith(".md"):
        return {"text": content.decode("utf-8", errors="ignore"), "video_url": None}
    elif filename.endswith(".mp4") or filename.endswith(".mov"):
        return await process_video_securely(file, content)
    else:
        # Fallback for unsupported types
        return {"text": "", "video_url": None}

@router.post("/admin/generate-course")
async def generate_course(files: List[UploadFile] = File(...), current_user: User = Depends(get_current_active_user)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    if not client:
        # Provide a mock response if no API key is set so the frontend can still be tested
        return {
            "title": "Mock Generated Course",
            "description": "This is a mock course because no Gemini API key was provided.",
            "modules": [
                {
                    "title": "Mock Module 1",
                    "lessons": [
                        {
                            "title": "Mock Lesson 1",
                            "type": "text",
                            "content": "This is mock text extracted from the uploaded files."
                        },
                        {
                            "title": "Mock Quiz",
                            "type": "quiz",
                            "questions": [
                                {
                                    "type": "multiple_choice",
                                    "question": "What is phishing?",
                                    "options": ["A scam", "A fish", "A sport"],
                                    "correct_answer": "A scam"
                                }
                            ]
                        }
                    ]
                }
            ]
        }

    combined_text = ""
    video_urls = []

    for file in files:
        content = await file.read()
        result = await process_file(file, content)

        extracted_text = result.get("text", "")
        vid_url = result.get("video_url")

        if extracted_text:
            combined_text += f"\n\n--- Source: {file.filename} ---\n{extracted_text}"
        if vid_url:
            video_urls.append({"filename": file.filename, "key": vid_url})

    if not combined_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from any of the provided files.")

    # Truncate text if it's absurdly long (Gemini 2.5 Flash has a ~1M token context, but we keep it reasonable)
    max_chars = 100000
    if len(combined_text) > max_chars:
        combined_text = combined_text[:max_chars]

    # Pass along video keys to the AI so it can optionally embed them in lessons
    video_context = ""
    if video_urls:
        video_context = "\nI have also processed some video files. If the material from a video is used in a text lesson, you MUST add a field 'video_url' to that lesson's JSON object and set it exactly to the provided Video Key.\n"
        for v in video_urls:
             video_context += f"Video Key ({v['filename']}): {v['key']}\n"

    prompt = f"""
    You are an expert instructional designer and curriculum developer.
    I have provided some source material below. Your job is to read this material and automatically generate a complete, structured course curriculum.

    The course should be structured as a JSON object containing:
    - title: A catchy title for the course
    - description: A brief summary of what the course covers
    - modules: A list of modules (chapters). Each module should have:
        - title: The module title
        - lessons: A list of lessons or interactive quizzes. Each lesson should have:
            - title: Lesson/Quiz title
            - type: "lesson" (for text content) OR "quiz" (for interactive questions)
            - content: (if type is "lesson") The instructional text/markdown for the lesson.
            - video_url: (optional) A string key if a video accompanies this lesson.
            - questions: (if type is "quiz") A list of interactive questions.

    For quizzes, you MUST include a mix of the following question types:
    1. "multiple_choice": Needs 'question', 'options' (array of strings), 'correct_answer' (string).
    2. "true_false": Needs 'question', 'correct_answer' (boolean).
    3. "fill_in_the_blank": Needs 'question' (with a ____ for the blank), 'correct_answer' (string).
    4. "match_the_pair": Needs 'pairs' (array of objects with 'left' and 'right' strings).
    5. "drag_drop_sort": Needs 'question', 'items' (array of strings in the correct order).

    Return ONLY a valid JSON object. Do not include markdown formatting like ```json.
    {video_context}

    --- SOURCE MATERIAL ---
    {combined_text}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                temperature=0.2, # Lower temperature for more structured JSON
            )
        )

        ai_text = response.text.strip()

        # Clean up if Gemini accidentally wrapped in markdown blocks
        if ai_text.startswith("```json"):
            ai_text = ai_text[7:]
        if ai_text.endswith("```"):
            ai_text = ai_text[:-3]

        course_data = json.loads(ai_text)
        return course_data

    except Exception as e:
        print(f"Error generating course: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate course using AI.")

class SaveCourseRequest(BaseModel):
    title: str
    description: str
    modules: List[Dict[str, Any]]

@router.post("/admin/save-course")
async def save_course(request: SaveCourseRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # Create the Course
    new_course = Course(
        title=request.title,
        description=request.description,
        is_published=True # For simplicity, publish immediately
    )
    db.add(new_course)
    await db.commit()
    await db.refresh(new_course)

    lesson_order = 0
    # Process modules/lessons
    for module in request.modules:
        for item in module.get("lessons", []):
            lesson_order += 1
            new_lesson = Lesson(
                course_id=new_course.id,
                title=f"{module.get('title', 'Module')} - {item.get('title', 'Lesson')}",
                type=item.get("type", "lesson"),
                content=item.get("content", ""),
                video_url=item.get("video_url"),
                order=lesson_order
            )
            db.add(new_lesson)
            await db.commit()
            await db.refresh(new_lesson)

            # If it's a quiz, save the questions
            if item.get("type") == "quiz" and "questions" in item:
                q_order = 0
                for q in item["questions"]:
                    q_order += 1

                    # Extract the type and main question string
                    q_type = q.get("type", "unknown")
                    q_text = q.get("question", "No question text provided")

                    # Store the rest of the options/answers as JSON config
                    config_data = {k: v for k, v in q.items() if k not in ["type", "question"]}

                    new_question = Question(
                        lesson_id=new_lesson.id,
                        type=q_type,
                        question_text=q_text,
                        config=json.dumps(config_data),
                        order=q_order
                    )
                    db.add(new_question)

                await db.commit()

    return {"message": "Course saved successfully", "course_id": new_course.id}
