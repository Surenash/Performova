import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import engine, Base, AsyncSessionLocal
from backend.models import (
    User, Course, Lesson, Module, Department, Team, CourseAssignment,
    Organization, Badge, UserBadge, LearningPath, PathCourse,
    CoursePrerequisite, Certificate, Skill, CourseSkill, UserSkill, AnalyticsSnapshot,
    UserProgress
)
from backend.auth import get_password_hash
from backend.seed_data import seed_database
from datetime import datetime, timedelta

async def init_db_content(session: AsyncSession):
    """
    Populates the database with initial seed data.
    Assumes tables already exist.
    """
    # 1. Create Organization
    org = Organization(
        name="Performova Corp",
        domain="performova.com"
    )
    session.add(org)
    await session.commit()
    await session.refresh(org)

    # 2. Create Department and Team linked to Org
    dept = Department(
        name="Cybersecurity",
        description="The security operations center",
        organization_id=org.id
    )
    session.add(dept)
    await session.commit()
    await session.refresh(dept)

    # 2b. Create a Manager
    manager = User(
        email="manager@example.com",
        hashed_password=get_password_hash("password"),
        full_name="Sarah Manager",
        role="Manager", # Fixed role
        organization_id=org.id,
        department_id=dept.id
    )
    session.add(manager)
    await session.commit()
    await session.refresh(manager)
    
    # Update Department and Team with lead/head
    dept.department_head_id = manager.id

    team = Team(
        name="Red Team",
        department_id=dept.id,
        organization_id=org.id,
        team_lead_id=manager.id
    )
    session.add(team)
    await session.commit()
    await session.refresh(team)

    # 3. Create Badge
    badge = Badge(
        name="Security Specialist",
        description="Awarded for completing 5 security courses",
        icon_url="/badges/security_specialist.png",
        criteria_type="course_count",
        criteria_value=5
    )
    session.add(badge)
    await session.commit()
    await session.refresh(badge)

    # 4. Create Standard User linked to Org and Manager
    learner = User(
        email="learner@example.com",
        hashed_password=get_password_hash("password"),
        full_name="Alex Learner",
        role="Learner",
        streak_days=14,
        xp_points=1200,
        department_id=dept.id,
        team_id=team.id,
        organization_id=org.id,
        manager_id=manager.id
    )
    session.add(learner)
    await session.commit()
    await session.refresh(learner)

    # 5. Award Badge to User
    user_badge = UserBadge(
        user_id=learner.id,
        badge_id=badge.id,
        awarded_at=datetime.utcnow()
    )
    session.add(user_badge)

    # 5b. Create Skills
    skill1 = Skill(name="Phishing Detection", category="Security", organization_id=org.id)
    skill2 = Skill(name="Risk Assessment", category="Security", organization_id=org.id)
    session.add_all([skill1, skill2])
    await session.commit()
    await session.refresh(skill1)
    await session.refresh(skill2)

    # 6. Create Courses linked to Org
    course1 = Course(
        title="Social Engineering Basics",
        description="Learn how to spot and avoid social engineering attacks.",
        is_published=True,
        time=15,
        organization_id=org.id,
        category="Security",
        difficulty="Beginner",
        estimated_cost=50.0
    )
    course2 = Course(
        title="Advanced Phishing Defense",
        description="Deeper dive into sophisticated phishing techniques.",
        is_published=True,
        time=30,
        organization_id=org.id,
        category="Security",
        difficulty="Intermediate",
        estimated_cost=120.0
    )
    session.add_all([course1, course2])
    await session.commit()
    await session.refresh(course1)
    await session.refresh(course2)

    # 6b. Link Course to Skill
    course_skill = CourseSkill(course_id=course1.id, skill_id=skill1.id, weight=1.0)
    session.add(course_skill)
    
    # 6c. Add User Skill
    user_skill = UserSkill(user_id=learner.id, skill_id=skill1.id, proficiency_level=3)
    session.add(user_skill)

    # 7. Add Course Prerequisite
    prereq = CoursePrerequisite(
        course_id=course2.id,
        required_course_id=course1.id
    )
    session.add(prereq)

    # 8. Create Module and Lessons for Course 1
    module1 = Module(
        course_id=course1.id,
        title="Module 1: Introduction",
        description="Basics of Social Engineering",
        order=1
    )
    session.add(module1)
    await session.commit()
    await session.refresh(module1)

    lessons = [
        Lesson(module_id=module1.id, title="Introduction Video", content="Watch this introduction.", order=1, estimated_time=5),
        Lesson(module_id=module1.id, title="Phishing Sandbox", content="Interactive sandbox.", order=2, estimated_time=10),
    ]
    session.add_all(lessons)
    await session.commit()
    
    # 8b. Add User Progress with started_at
    progress = UserProgress(
        user_id=learner.id,
        course_id=course1.id,
        lesson_id=lessons[0].id,
        is_completed=True,
        started_at=datetime.utcnow() - timedelta(hours=1),
        completed_at=datetime.utcnow()
    )
    session.add(progress)

    # 9. Create Learning Path
    learning_path = LearningPath(
        title="Security Onboarding",
        description="Essential security training for new hires",
        is_published=True,
        organization_id=org.id
    )
    session.add(learning_path)
    await session.commit()
    await session.refresh(learning_path)

    # 10. Associate Courses with Learning Path
    path_courses = [
        PathCourse(path_id=learning_path.id, course_id=course1.id, order=1),
        PathCourse(path_id=learning_path.id, course_id=course2.id, order=2)
    ]
    session.add_all(path_courses)

    # 11. Assign Learning Path to User
    assignment = CourseAssignment(
        user_id=learner.id,
        learning_path_id=learning_path.id,
        assigned_date=datetime.utcnow(),
        started_at=datetime.utcnow() - timedelta(minutes=30),
        due_date=datetime.utcnow() + timedelta(days=30),
        is_mandatory=True,
        status="in_progress"
    )
    session.add(assignment)

    # 11b. Add Analytics Snapshot
    snapshot = AnalyticsSnapshot(
        organization_id=org.id,
        metric_name="average_course_completion",
        metric_value=75.5,
        dimension="global"
    )
    session.add(snapshot)

    # 12. Grant Certificate
    cert = Certificate(
        user_id=learner.id,
        course_id=course1.id,
        issue_date=datetime.utcnow() - timedelta(days=1),
        certificate_url="https://example.com/certs/abc-123.pdf"
    )
    session.add(cert)
    
    # 13. Create System Admin
    admin = User(
        email="admin@performa.com",
        hashed_password=get_password_hash("admin"),
        full_name="System Admin",
        role="Admin",
        is_admin=True,
        organization_id=org.id
    )
    session.add(admin)

    await session.commit()
    print("Basic DB entities initialized.")
    
    # 14. Run the seed_data module to populate DemoConfigs and other standard seed data
    await seed_database(session)

    print("Database initialization complete.")

async def init_db():
    async with engine.begin() as conn:
        # Warning: Only use drop_all in development
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await init_db_content(session)

if __name__ == "__main__":
    asyncio.run(init_db())
