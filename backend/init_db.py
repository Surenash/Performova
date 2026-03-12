import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import engine, Base
from backend.models import User, Course, Lesson
from backend.auth import get_password_hash

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession(engine) as session:
        # Create standard learner
        learner = User(
            email="learner@example.com",
            hashed_password=get_password_hash("password"),
            full_name="Alex Learner",
            role="Learner",
            streak_days=14,
            xp_points=1200
        )
        session.add(learner)

        # Create a sample course
        course1 = Course(
            title="Social Engineering Basics",
            description="Learn how to spot and avoid social engineering attacks.",
            is_published=True
        )
        session.add(course1)
        await session.commit()
        await session.refresh(course1)

        # Add lessons to course
        lessons = [
            Lesson(course_id=course1.id, title="Introduction Video", content="Watch this introduction.", order=1),
            Lesson(course_id=course1.id, title="Phishing Sandbox", content="Interactive sandbox.", order=2),
        ]
        session.add_all(lessons)
        await session.commit()
        print("Database initialized successfully.")

if __name__ == "__main__":
    asyncio.run(init_db())
