import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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

async def get_or_create_org(session: AsyncSession, name: str, domain: str):
    result = await session.execute(select(Organization).filter(Organization.domain == domain))
    org = result.scalars().first()
    if not org:
        org = Organization(name=name, domain=domain)
        session.add(org)
        await session.commit()
        await session.refresh(org)
    return org

async def get_or_create_dept(session: AsyncSession, name: str, org_id: int, description: str = None):
    result = await session.execute(select(Department).filter(Department.name == name, Department.organization_id == org_id))
    dept = result.scalars().first()
    if not dept:
        dept = Department(name=name, organization_id=org_id, description=description)
        session.add(dept)
        await session.commit()
        await session.refresh(dept)
    return dept

async def get_or_create_user(session: AsyncSession, email: str, password: str, full_name: str, role: str, org_id: int, **kwargs):
    result = await session.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user:
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            role=role,
            organization_id=org_id,
            **kwargs
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
    return user

async def get_or_create_team(session: AsyncSession, name: str, dept_id: int, org_id: int, lead_id: int = None):
    result = await session.execute(select(Team).filter(Team.name == name, Team.department_id == dept_id))
    team = result.scalars().first()
    if not team:
        team = Team(name=name, department_id=dept_id, organization_id=org_id, team_lead_id=lead_id)
        session.add(team)
        await session.commit()
        await session.refresh(team)
    return team

async def get_or_create_badge(session: AsyncSession, name: str, **kwargs):
    result = await session.execute(select(Badge).filter(Badge.name == name))
    badge = result.scalars().first()
    if not badge:
        badge = Badge(name=name, **kwargs)
        session.add(badge)
        await session.commit()
        await session.refresh(badge)
    return badge

async def get_or_create_skill(session: AsyncSession, name: str, org_id: int, category: str = None):
    result = await session.execute(select(Skill).filter(Skill.name == name, Skill.organization_id == org_id))
    skill = result.scalars().first()
    if not skill:
        skill = Skill(name=name, organization_id=org_id, category=category)
        session.add(skill)
        await session.commit()
        await session.refresh(skill)
    return skill

async def get_or_create_course(session: AsyncSession, title: str, org_id: int, **kwargs):
    result = await session.execute(select(Course).filter(Course.title == title, Course.organization_id == org_id))
    course = result.scalars().first()
    if not course:
        course = Course(title=title, organization_id=org_id, **kwargs)
        session.add(course)
        await session.commit()
        await session.refresh(course)
    return course

async def get_or_create_module(session: AsyncSession, title: str, course_id: int, order: int, description: str = None):
    result = await session.execute(select(Module).filter(Module.title == title, Module.course_id == course_id))
    module = result.scalars().first()
    if not module:
        module = Module(title=title, course_id=course_id, order=order, description=description)
        session.add(module)
        await session.commit()
        await session.refresh(module)
    return module

async def get_or_create_lesson(session: AsyncSession, title: str, module_id: int, order: int, **kwargs):
    result = await session.execute(select(Lesson).filter(Lesson.title == title, Lesson.module_id == module_id))
    lesson = result.scalars().first()
    if not lesson:
        lesson = Lesson(title=title, module_id=module_id, order=order, **kwargs)
        session.add(lesson)
        await session.commit()
        await session.refresh(lesson)
    return lesson

async def get_or_create_learning_path(session: AsyncSession, title: str, org_id: int, **kwargs):
    result = await session.execute(select(LearningPath).filter(LearningPath.title == title, LearningPath.organization_id == org_id))
    path = result.scalars().first()
    if not path:
        path = LearningPath(title=title, organization_id=org_id, **kwargs)
        session.add(path)
        await session.commit()
        await session.refresh(path)
    return path

async def init_db_content(session: AsyncSession):
    """
    Populates the database with initial seed data.
    Idempotent: checks for existence before creation.
    """
    # 1. Create Organization
    org = await get_or_create_org(session, "Performova Corp", "performova.com")

    # 2. Create Department
    dept = await get_or_create_dept(session, "Cybersecurity", org.id, "The security operations center")

    # 2b. Create a Manager
    manager = await get_or_create_user(
        session, "manager@example.com", "password", "Sarah Manager", "Manager", org.id,
        department_id=dept.id
    )
    
    # Update Department with head if not set
    if dept.department_head_id != manager.id:
        dept.department_head_id = manager.id
        session.add(dept)
        await session.commit()

    # Create Team
    team = await get_or_create_team(session, "Red Team", dept.id, org.id, manager.id)

    # 3. Create Badge
    badge = await get_or_create_badge(
        session, "Security Specialist",
        description="Awarded for completing 5 security courses",
        icon_url="/badges/security_specialist.png",
        criteria_type="course_count",
        criteria_value=5
    )

    # 4. Create Standard User
    learner = await get_or_create_user(
        session, "learner@example.com", "password", "Alex Learner", "Learner", org.id,
        streak_days=14,
        xp_points=1200,
        department_id=dept.id,
        team_id=team.id,
        manager_id=manager.id
    )

    # 5. Award Badge to User
    res_ub = await session.execute(select(UserBadge).filter(UserBadge.user_id == learner.id, UserBadge.badge_id == badge.id))
    if not res_ub.scalars().first():
        user_badge = UserBadge(user_id=learner.id, badge_id=badge.id, awarded_at=datetime.utcnow())
        session.add(user_badge)

    # 5b. Create Skills
    skill1 = await get_or_create_skill(session, "Phishing Detection", org.id, "Security")
    skill2 = await get_or_create_skill(session, "Risk Assessment", org.id, "Security")

    # 6. Create Courses
    course1 = await get_or_create_course(
        session, "Social Engineering Basics", org.id,
        description="Learn how to spot and avoid social engineering attacks.",
        is_published=True,
        time=15,
        category="Security",
        difficulty="Beginner",
        estimated_cost=50.0
    )
    course2 = await get_or_create_course(
        session, "Advanced Phishing Defense", org.id,
        description="Deeper dive into sophisticated phishing techniques.",
        is_published=True,
        time=30,
        category="Security",
        difficulty="Intermediate",
        estimated_cost=120.0
    )

    # 6b. Link Course to Skill
    res_cs = await session.execute(select(CourseSkill).filter(CourseSkill.course_id == course1.id, CourseSkill.skill_id == skill1.id))
    if not res_cs.scalars().first():
        course_skill = CourseSkill(course_id=course1.id, skill_id=skill1.id, weight=1.0)
        session.add(course_skill)
    
    # 6c. Add User Skill
    res_us = await session.execute(select(UserSkill).filter(UserSkill.user_id == learner.id, UserSkill.skill_id == skill1.id))
    if not res_us.scalars().first():
        user_skill = UserSkill(user_id=learner.id, skill_id=skill1.id, proficiency_level=3)
        session.add(user_skill)

    # 7. Add Course Prerequisite
    res_prereq = await session.execute(select(CoursePrerequisite).filter(CoursePrerequisite.course_id == course2.id, CoursePrerequisite.required_course_id == course1.id))
    if not res_prereq.scalars().first():
        prereq = CoursePrerequisite(course_id=course2.id, required_course_id=course1.id)
        session.add(prereq)

    # 8. Create Module and Lessons for Course 1
    module1 = await get_or_create_module(session, "Module 1: Introduction", course1.id, 1, "Basics of Social Engineering")

    lesson1 = await get_or_create_lesson(session, "Introduction Video", module1.id, 1, content="Watch this introduction.", estimated_time=5)
    lesson2 = await get_or_create_lesson(session, "Phishing Sandbox", module1.id, 2, content="Interactive sandbox.", estimated_time=10)

    # 8b. Add User Progress
    res_prog = await session.execute(select(UserProgress).filter(UserProgress.user_id == learner.id, UserProgress.course_id == course1.id, UserProgress.lesson_id == lesson1.id))
    if not res_prog.scalars().first():
        progress = UserProgress(
            user_id=learner.id,
            course_id=course1.id,
            lesson_id=lesson1.id,
            is_completed=True,
            started_at=datetime.utcnow() - timedelta(hours=1),
            completed_at=datetime.utcnow()
        )
        session.add(progress)

    # 9. Create Learning Path
    learning_path = await get_or_create_learning_path(
        session, "Security Onboarding", org.id,
        description="Essential security training for new hires",
        is_published=True
    )

    # 10. Associate Courses with Learning Path
    for i, c in enumerate([course1, course2]):
        res_pc = await session.execute(select(PathCourse).filter(PathCourse.path_id == learning_path.id, PathCourse.course_id == c.id))
        if not res_pc.scalars().first():
            path_course = PathCourse(path_id=learning_path.id, course_id=c.id, order=i + 1)
            session.add(path_course)

    # 11. Assign Learning Path to User
    res_ca = await session.execute(select(CourseAssignment).filter(CourseAssignment.user_id == learner.id, CourseAssignment.learning_path_id == learning_path.id))
    if not res_ca.scalars().first():
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
    # Snapshots are usually point-in-time, but for seeding we might want to avoid duplicates if they have the same data
    res_snap = await session.execute(select(AnalyticsSnapshot).filter(
        AnalyticsSnapshot.organization_id == org.id,
        AnalyticsSnapshot.metric_name == "average_course_completion",
        AnalyticsSnapshot.dimension == "global"
    ))
    if not res_snap.scalars().first():
        snapshot = AnalyticsSnapshot(
            organization_id=org.id,
            metric_name="average_course_completion",
            metric_value=75.5,
            dimension="global"
        )
        session.add(snapshot)

    # 12. Grant Certificate
    res_cert = await session.execute(select(Certificate).filter(Certificate.user_id == learner.id, Certificate.course_id == course1.id))
    if not res_cert.scalars().first():
        cert = Certificate(
            user_id=learner.id,
            course_id=course1.id,
            issue_date=datetime.utcnow() - timedelta(days=1),
            certificate_url="https://example.com/certs/abc-123.pdf"
        )
        session.add(cert)
    
    # 13. Create System Admin
    # Using org.id or not? The original script used org.id.
    admin = await get_or_create_user(
        session, "admin@performa.com", "admin", "System Admin", "Admin", org.id,
        is_admin=True
    )

    await session.commit()
    print("Basic DB entities initialized (idempotent).")
    
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
