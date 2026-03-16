from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_matrix_admin import MatrixAdmin
from backend.database import engine, Base, get_db, DATABASE_PATH
from backend.models import (
    User, Course, Module, Lesson, UserProgress, ChatMessage, DemoConfig, Question, 
    QuizAttempt, QuestionResponse, UserSession, CourseFeedback, Department, Team, 
    CourseAssignment, ActivityLog, Organization, Badge, UserBadge, LearningPath, 
    Certificate, PathCourse, CoursePrerequisite, Skill, CourseSkill, UserSkill, AnalyticsSnapshot
)
from backend.auth import authenticate_user, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_active_user
from backend.ai_chat import router as ai_router
from backend.course_generation import router as course_router
from backend.routers.data_router import router as data_router
from backend.routers.analytics_router import router as analytics_router
from datetime import timedelta
import asyncio
import os

app = FastAPI(title="Performova LMS API")

# Add CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Matrix Admin with the primary ASYNC engine
admin = MatrixAdmin(
    app,
    engine=engine,
    secret_key=os.getenv("MATRIX_ADMIN_SECRET", "my-super-secret-matrix-key-change-it-now"),
    title="Performova Admin",
)

# Register Matrix Admin Models explicitly at top level
admin.register(Organization, icon="globe", list_display=["id", "name", "domain"])
admin.register(Department, icon="building", list_display=["id", "name", "organization_id"])
admin.register(Team, icon="users", list_display=["id", "name", "department_id", "organization_id"])
admin.register(User, icon="user", list_display=["id", "email", "full_name", "role", "manager_id", "organization_id"])
admin.register(Badge, icon="award", list_display=["id", "name", "criteria_type", "criteria_value"])
admin.register(UserBadge, icon="shield", list_display=["id", "user_id", "badge_id", "awarded_at"])
admin.register(LearningPath, icon="map", list_display=["id", "title", "organization_id", "is_published"])
admin.register(Course, icon="book-open", list_display=["id", "title", "organization_id", "category", "estimated_cost", "is_published"])
admin.register(Module, icon="folder", list_display=["id", "title", "course_id", "order"])
admin.register(Lesson, icon="file-text", list_display=["id", "title", "module_id", "type", "order"])
admin.register(CourseAssignment, icon="clipboard-list", list_display=["id", "user_id", "course_id", "learning_path_id", "status"])
admin.register(Certificate, icon="check-circle", list_display=["id", "user_id", "course_id", "issue_date"])
admin.register(ActivityLog, icon="activity", list_display=["id", "user_id", "activity_type", "xp_awarded"])
admin.register(Question, icon="help-circle", list_display=["id", "lesson_id", "type", "order"])
admin.register(DemoConfig, icon="database", list_display=["id", "demo_type"])
admin.register(UserProgress, icon="trending-up", list_display=["id", "user_id", "course_id", "lesson_id", "is_completed"])
admin.register(ChatMessage, icon="message-square", list_display=["id", "user_id", "is_bot", "created_at"])
admin.register(QuizAttempt, icon="check-square", list_display=["id", "user_id", "lesson_id", "score", "passed"])
admin.register(QuestionResponse, icon="list", list_display=["id", "attempt_id", "question_id", "is_correct"])
admin.register(UserSession, icon="clock", list_display=["id", "user_id", "login_at", "logout_at"])
admin.register(CourseFeedback, icon="star", list_display=["id", "course_id", "user_id", "rating"])
admin.register(PathCourse, icon="list-ol", list_display=["id", "path_id", "course_id", "order"])
admin.register(CoursePrerequisite, icon="link", list_display=["id", "course_id", "required_course_id"])
admin.register(Skill, icon="star", list_display=["id", "name", "category", "organization_id"])
admin.register(CourseSkill, icon="link", list_display=["id", "course_id", "skill_id", "weight"])
admin.register(UserSkill, icon="user-check", list_display=["id", "user_id", "skill_id", "proficiency_level"])
admin.register(AnalyticsSnapshot, icon="bar-chart", list_display=["id", "metric_name", "metric_value", "dimension", "timestamp"])

# Register models in Admin
@app.on_event("startup")
async def startup_event():
    # 1. Create DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Create initial superuser for Admin
    async with AsyncSession(engine) as session:
        from sqlalchemy.future import select
        result = await session.execute(select(User).filter(User.email == "admin@performa.com"))
        admin_user = result.scalars().first()
        if not admin_user:
            hashed_pwd = get_password_hash("admin")
            new_admin = User(
                email="admin@performa.com",
                hashed_password=hashed_pwd,
                full_name="System Admin",
                is_admin=True,
                role="Admin"
            )
            session.add(new_admin)
            await session.commit()
            print("Initial admin user created: admin@performa.com / admin")
            
        # 3. Seed Data
        # We'll skip seed_database here because we're using init_db.py for the schema enhancements
        # from backend.seed_data import seed_database
        # await seed_database(session)

# Include routes

app.include_router(ai_router, prefix="/api", tags=["AI Coach"])
app.include_router(course_router, prefix="/api", tags=["Course Generation"])
app.include_router(data_router, prefix="/api", tags=["Demo Data"])
app.include_router(analytics_router, prefix="/api", tags=["Analytics"])

@app.post("/api/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    from backend.auth import get_user_by_email, verify_password
    user = await get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# --- Basic CRUD Endpoints for Frontend ---

@app.get("/api/users/me", tags=["Users"])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "streak_days": current_user.streak_days,
        "xp_points": current_user.xp_points
    }

@app.get("/api/courses", tags=["Courses"])
async def get_courses(db: AsyncSession = Depends(get_db)):
    from sqlalchemy.future import select
    result = await db.execute(select(Course).filter(Course.is_published == True))
    courses = result.scalars().all()
    return courses

@app.get("/api/courses/{course_id}", tags=["Courses"])
async def get_course_details(course_id: int, db: AsyncSession = Depends(get_db)):
    from sqlalchemy.future import select
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Course)
        .options(
            selectinload(Course.modules)
            .selectinload(Module.lessons)
            .selectinload(Lesson.questions)
        )
        .filter(Course.id == course_id)
    )
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Dynamically generate presigned URLs for any associated videos
    for module in course.modules:
        for lesson in module.lessons:
            if lesson.video_url and not lesson.video_url.startswith("http"):
                lesson.video_url = generate_presigned_url(lesson.video_url)

    return course

@app.get("/api/progress", tags=["Progress"])
async def get_my_progress(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    from sqlalchemy.future import select
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(UserProgress)
        .options(selectinload(UserProgress.course), selectinload(UserProgress.lesson))
        .filter(UserProgress.user_id == current_user.id)
    )
    return result.scalars().all()
