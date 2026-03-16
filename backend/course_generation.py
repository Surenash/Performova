import io
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import os
import json
import uuid
import boto3
from pydantic import BaseModel
from backend.database import get_db
from backend.models import Course, Module, Lesson, Question, User
from backend.auth import get_current_active_user

router = APIRouter()

# --- Async Agentic Factory Mock Trigger ---

@router.post("/admin/generate-course")
async def trigger_agentic_factory(
    files: List[UploadFile] = File(...), 
    current_user: User = Depends(get_current_active_user)
):
    """
    In the new Architecture, the frontend uploads directly to S3.
    This endpoint mocks receiving that notification and triggering the Step Functions workflow.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    # MOCK: In reality, the frontend requests a Presigned URL from a different endpoint, 
    # uploads the file, and then S3 triggers EventBridge -> Step Functions.
    # We are simulating the "start" of that asynchronous process here.
    
    # 1. Generate a unique job ID
    job_id = str(uuid.uuid4())
    
    # 2. Simulate triggering AWS Step Functions
    try:
        # sfn_client = boto3.client('stepfunctions', region_name='ap-south-1')
        # response = sfn_client.start_execution(
        #     stateMachineArn='arn:aws:states:ap-south-1:123456789012:stateMachine:AgenticFactory',
        #     name=job_id,
        #     input=json.dumps({"files": [f.filename for f in files], "user_id": current_user.id})
        # )
        print(f"Mocked triggering AWS Step Functions for job: {job_id}")
    except Exception as e:
        print(f"AWS Error: {e}")
        # Proceeding despite mock error

    # 3. Return immediately (202 Accepted logic)
    return {
        "status": "processing",
        "message": "Course generation started asynchronously via Agentic Factory.",
        "job_id": job_id,
        "mock_note": "In a real deployment, the frontend would poll for completion or receive a WebSocket event."
    }

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
        is_published=True, # For simplicity, publish immediately
        time=30 # Default 30 mins, could be calculated later
    )
    db.add(new_course)
    await db.commit()
    await db.refresh(new_course)

    module_order = 0
    # Process modules/lessons
    for module_data in request.modules:
        module_order += 1
        new_module = Module(
            course_id=new_course.id,
            title=module_data.get("title", f"Module {module_order}"),
            description=module_data.get("description", ""),
            order=module_order
        )
        db.add(new_module)
        await db.commit()
        await db.refresh(new_module)

        lesson_order = 0
        for item in module_data.get("lessons", []):
            lesson_order += 1
            new_lesson = Lesson(
                module_id=new_module.id,
                title=item.get("title", "Lesson"),
                type=item.get("type", "lesson"),
                content=item.get("content", ""),
                video_url=item.get("video_url"),
                order=lesson_order,
                estimated_time=5 # Default 5 mins per lesson
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
