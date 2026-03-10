import io
import PyPDF2
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import os
from google import genai
import json
from backend.database import get_db
from backend.models import Course, Lesson, Question
from pydantic import BaseModel

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

def mock_extract_text_from_video(filename: str) -> str:
    """
    Mock function representing extracting subtitles from a video via YouTube fallback.
    In a real scenario, this would involve uploading to YouTube via API, waiting for processing,
    and then fetching the auto-generated captions.
    """
    return f"This is mock transcribed text extracted from the video file: {filename}. It talks about important concepts related to cybersecurity and phishing."

def process_file(file: UploadFile, content: bytes) -> str:
    """Process a single file and return its extracted text."""
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        return extract_text_from_pdf(content)
    elif filename.endswith(".txt") or filename.endswith(".md"):
        return content.decode("utf-8", errors="ignore")
    elif filename.endswith(".mp4") or filename.endswith(".mov"):
        return mock_extract_text_from_video(filename)
    else:
        # Fallback for unsupported types
        return ""

@router.post("/admin/generate-course")
async def generate_course(files: List[UploadFile] = File(...)):
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
    for file in files:
        content = await file.read()
        extracted = process_file(file, content)
        if extracted:
            combined_text += f"\n\n--- Source: {file.filename} ---\n{extracted}"

    if not combined_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from any of the provided files.")

    # Truncate text if it's absurdly long (Gemini 2.5 Flash has a ~1M token context, but we keep it reasonable)
    max_chars = 100000
    if len(combined_text) > max_chars:
        combined_text = combined_text[:max_chars]

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
            - questions: (if type is "quiz") A list of interactive questions.

    For quizzes, you MUST include a mix of the following question types:
    1. "multiple_choice": Needs 'question', 'options' (array of strings), 'correct_answer' (string).
    2. "true_false": Needs 'question', 'correct_answer' (boolean).
    3. "fill_in_the_blank": Needs 'question' (with a ____ for the blank), 'correct_answer' (string).
    4. "match_the_pair": Needs 'pairs' (array of objects with 'left' and 'right' strings).
    5. "drag_drop_sort": Needs 'question', 'items' (array of strings in the correct order).

    Return ONLY a valid JSON object. Do not include markdown formatting like ```json.

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
async def save_course(request: SaveCourseRequest, db: AsyncSession = Depends(get_db)):
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
