from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_matrix_admin import MatrixAdmin
from backend.database import engine, Base, get_db
from backend.models import User, Course, Lesson, UserProgress, ChatMessage
from backend.auth import authenticate_user, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_active_user
from backend.ai_chat import router as ai_router
from backend.course_generation import router as course_router
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

# Initialize Matrix Admin
admin = MatrixAdmin(
    app,
    engine=engine,
    secret_key=os.getenv("MATRIX_ADMIN_SECRET", "my-super-secret-matrix-key-change-it-now"),
    title="Performova Admin",
)

# Register models in Admin
@app.on_event("startup")
async def startup_event():
    # 1. Create DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Auto-discover Matrix Admin
    admin.auto_discover(Base)

    # 3. Create initial superuser for Admin
    async with AsyncSession(engine) as session:
        from sqlalchemy.future import select
        result = await session.execute(select(User).filter(User.email == "admin@performova.com"))
        admin_user = result.scalars().first()
        if not admin_user:
            hashed_pwd = get_password_hash("admin")
            new_admin = User(
                email="admin@performova.com",
                hashed_password=hashed_pwd,
                full_name="System Admin",
                is_admin=True,
                role="Admin"
            )
            session.add(new_admin)
            await session.commit()
            print("Initial admin user created: admin@performova.com / admin")

# Include AI Chat routes
app.include_router(ai_router, prefix="/api", tags=["AI Coach"])
app.include_router(course_router, prefix="/api", tags=["Course Generation"])

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
        .options(selectinload(Course.lessons).selectinload(Lesson.questions))
        .filter(Course.id == course_id)
    )
    course = result.scalars().first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
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
