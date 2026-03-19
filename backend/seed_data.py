import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models import Course, Module, Lesson, Question, DemoConfig, User, Department, Team, CourseAssignment, Organization
from datetime import datetime, timedelta

# Rich seed data for courses and modules
COURSES_DATA = [
    {
        "title": "Cybersecurity Awareness 2024",
        "description": "Essential security training for all employees covering phishing, social engineering, and password safety.",
        "category": "Security",
        "time": 45,
        "format": "interactive",
        "difficulty": "Beginner",
        "image": "https://picsum.photos/seed/cyber/800/400",
        "color": "indigo",
        "modules": [
            {
                "title": "Module 1: Phishing Foundations",
                "description": "Learn to identify common phishing tactics.",
                "lessons": [
                    {
                        "title": "The Art of Deception",
                        "type": "lesson",
                        "content": "Phishing is a type of social engineering where an attacker sends a fraudulent message designed to trick a human victim into revealing sensitive information.",
                        "estimated_time": 5
                    },
                    {
                        "title": "Spot the Hook: Quiz",
                        "type": "quiz",
                        "questions": [
                            {
                                "type": "multiple_choice",
                                "question_text": "Which of these is a common sign of a phishing email?",
                                "config": {
                                    "options": ["Urgent language", "Generic greeting", "Mismatched links", "All of the above"],
                                    "correct_answer": "All of the above"
                                }
                            },
                            {
                                "type": "true_false",
                                "question_text": "Company IT will often ask for your password via email for maintenance.",
                                "config": {
                                    "correct_answer": "False"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Module 2: Password Security",
                "description": "Creating and managing strong credentials.",
                "lessons": [
                    {
                        "title": "Complexity and Beyond",
                        "type": "lesson",
                        "content": "Long passphrases are better than short complex passwords.",
                        "estimated_time": 5
                    }
                ]
            }
        ]
    },
    {
        "title": "Data Privacy & GDPR",
        "description": "Understand your responsibilities under global data protection regulations.",
        "category": "Compliance",
        "time": 30,
        "format": "text",
        "difficulty": "Intermediate",
        "image": "https://picsum.photos/seed/privacy/800/400",
        "color": "emerald",
        "modules": [
            {
                "title": "Module 1: GDPR Principles",
                "description": "The 7 core principles of GDPR.",
                "lessons": [
                    {
                        "title": "Lawfulness, Fairness, and Transparency",
                        "type": "lesson",
                        "content": "Data processing must be lawful, fair, and transparent to the data subject.",
                        "estimated_time": 10
                    }
                ]
            }
        ]
    }
]

DEMO_DATA = {
    "flashcards": [
        { "front": "What is a firewall?", "back": "A network security device that monitors and filters traffic.", "category": "Network Security" },
        { "front": "What is MFA?", "back": "Multi-Factor Authentication - requiring more than one piece of evidence to verify identity.", "category": "Access Control" }
    ],
    "security_sort": [
        { "id": "1", "text": "Using a password manager", "category": "safe", "hint": "Highly recommended." },
        { "id": "2", "text": "Writing your password on a sticky note", "category": "risk", "hint": "Physical security risk." }
    ],
    "protocol_match": [
        { "protocol": "HTTPS", "port": "443" },
        { "protocol": "SSH", "port": "22" },
        { "protocol": "FTP", "port": "21" }
    ],
    "quick_quiz": [
        { "question": "What does 2FA stand for?", "options": ["Two-Factor Authentication", "Two-File Access", "Two-Firewall Application"], "correctIndex": 0, "explanation": "It adds an extra layer of security." }
    ]
}

async def seed_database(session: AsyncSession):
    """
    Seeds the database with missing standard entities.
    Idempotent: Only adds if missing.
    """
    print("Checking for missing courses...")
    
    # Try to get the default organization to link courses to it
    res_org = await session.execute(select(Organization).filter(Organization.domain == "performova.com"))
    org = res_org.scalars().first()
    org_id = org.id if org else None

    for c_data in COURSES_DATA:
        result = await session.execute(select(Course).filter(Course.title == c_data["title"]))
        course = result.scalars().first()
        
        if not course:
            print(f"Adding course: {c_data['title']}")
            course = Course(
                title=c_data["title"],
                description=c_data["description"],
                category=c_data["category"],
                time=c_data["time"],
                format=c_data["format"],
                difficulty=c_data["difficulty"],
                image=c_data["image"],
                color=c_data["color"],
                is_published=True,
                organization_id=org_id
            )
            session.add(course)
            await session.commit()
            await session.refresh(course)

        for i, m_data in enumerate(c_data["modules"]):
            res_mod = await session.execute(select(Module).filter(Module.course_id == course.id, Module.title == m_data["title"]))
            module = res_mod.scalars().first()
            
            if not module:
                print(f"  Adding module: {m_data['title']}")
                module = Module(
                    course_id=course.id,
                    title=m_data["title"],
                    description=m_data["description"],
                    order=i + 1
                )
                session.add(module)
                await session.commit()
                await session.refresh(module)

            for j, l_data in enumerate(m_data["lessons"]):
                res_lesson = await session.execute(select(Lesson).filter(Lesson.module_id == module.id, Lesson.title == l_data["title"]))
                lesson = res_lesson.scalars().first()
                
                if not lesson:
                    print(f"    Adding lesson: {l_data['title']}")
                    lesson = Lesson(
                        module_id=module.id,
                        title=l_data["title"],
                        type=l_data["type"],
                        content=l_data.get("content", ""),
                        order=j + 1,
                        estimated_time=l_data.get("estimated_time", 5)
                    )
                    session.add(lesson)
                    await session.commit()
                    await session.refresh(lesson)

                if "questions" in l_data:
                    for k, q_data in enumerate(l_data["questions"]):
                        res_q = await session.execute(select(Question).filter(Question.lesson_id == lesson.id, Question.question_text == q_data["question_text"]))
                        if not res_q.scalars().first():
                            print(f"      Adding question: {q_data['question_text'][:30]}...")
                            question = Question(
                                lesson_id=lesson.id,
                                type=q_data["type"],
                                question_text=q_data["question_text"],
                                config=json.dumps(q_data["config"]),
                                order=k + 1
                            )
                            session.add(question)
        await session.commit()

    print("Checking for missing DemoConfigs...")
    # Generate dashboard_data dynamically to ensure IDs match
    res_learner = await session.execute(select(User).filter(User.role == "Learner").limit(1))
    learner = res_learner.scalars().first()
    
    dashboard_data = {
        "learner": {
            "path_nodes": [
                { "id": 1, "title": "Phishing Foundations", "status": "completed", "type": "lesson" },
                { "id": 2, "title": "Spot the Hook", "status": "current", "type": "quiz" },
                { "id": 3, "title": "Complexity and Beyond", "status": "locked", "type": "lesson" }
            ],
            "continue_courses": [
                { "id": 1, "title": "Cybersecurity Awareness 2024", "progress": 33, "lessonsLeft": 2 },
                { "id": 2, "title": "Data Privacy & GDPR", "progress": 0, "lessonsLeft": 1 }
            ]
        },
        "admin": {
            "team": [
                { "id": learner.id if learner else 1, "name": learner.full_name if learner else "Alex Learner", "role": learner.role if learner else "Learner", "progress": 33, "status": "On Track", "avatar": f"https://i.pravatar.cc/150?u={learner.id if learner else 1}", "coursesCompleted": 0 }
            ],
            "activities": [
                { "action": f"{learner.full_name if learner else 'Alex Learner'} started", "course": "Cybersecurity Awareness 2024", "time": "Just now", "color": "indigo" }
            ]
        }
    }
    
    all_demos = {**DEMO_DATA, "dashboard_data": dashboard_data}
    for d_type, d_config in all_demos.items():
        result = await session.execute(select(DemoConfig).filter(DemoConfig.demo_type == d_type))
        if not result.scalars().first():
            print(f"Adding DemoConfig: {d_type}")
            config = DemoConfig(demo_type=d_type, config_json=json.dumps(d_config))
            session.add(config)
            
    await session.commit()
    print("Database seeding check completed.")
