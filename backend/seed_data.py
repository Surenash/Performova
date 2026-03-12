import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models import Course, DemoConfig, User
from backend.auth import get_password_hash

# 1. Mock Courses
COURSES_DATA = [
  { "id": 1, "title": "Data Privacy 101", "category": "Compliance", "time": "15 min", "format": "interactive", "difficulty": "Beginner", "image": "https://picsum.photos/seed/privacy/400/200", "color": "bg-blue-100", "is_published": True },
  { "id": 2, "title": "Effective Feedback", "category": "Leadership", "time": "30 min", "format": "video", "difficulty": "Intermediate", "image": "https://picsum.photos/seed/feedback/400/200", "color": "bg-purple-100", "is_published": True },
  { "id": 3, "title": "Phishing Defense", "category": "Security", "time": "10 min", "format": "interactive", "difficulty": "Beginner", "image": "https://picsum.photos/seed/phishing/400/200", "color": "bg-red-100", "is_published": True },
  { "id": 4, "title": "React Advanced", "category": "Technical", "time": "2 hrs", "format": "text", "difficulty": "Advanced", "image": "https://picsum.photos/seed/react/400/200", "color": "bg-cyan-100", "is_published": True },
  { "id": 5, "title": "Company Culture", "category": "Onboarding", "time": "20 min", "format": "video", "difficulty": "Beginner", "image": "https://picsum.photos/seed/culture/400/200", "color": "bg-orange-100", "is_published": True },
  { "id": 6, "title": "Secure Coding", "category": "Security", "time": "45 min", "format": "interactive", "difficulty": "Intermediate", "image": "https://picsum.photos/seed/secure/400/200", "color": "bg-emerald-100", "is_published": True },
]

# 2. Mock Flashcards
FLASHCARDS_DATA = [
    { "front": "What is a firewall?", "back": "A network security device that monitors and filters incoming and outgoing network traffic based on an organization's security policies.", "category": "Network Security" },
    { "front": "What is encryption?", "back": "The process of converting information into a secret code that hides the information's true meaning. Only authorized parties can decipher it.", "category": "Data Protection" },
    { "front": "What is social engineering?", "back": "The psychological manipulation of people into performing actions or divulging confidential information, rather than using technical hacking.", "category": "Threat Awareness" },
    { "front": "What is a VPN?", "back": "A Virtual Private Network creates an encrypted connection over the internet between a device and a network, protecting data in transit.", "category": "Network Security" },
]

# 3. Mock Security Sort Game Items
SECURITY_SORT_DATA = [
    { "id": "1", "text": "Using 'Password123' for all accounts", "category": "risk", "hint": "Reuse and weak patterns are easy to crack." },
    { "id": "2", "text": "Enabling Multi-Factor Authentication (MFA)", "category": "safe", "hint": "Adds a critical layer of defense." },
    { "id": "3", "text": "Leaving your laptop unlocked in a cafe", "category": "risk", "hint": "Physical access is a major vulnerability." },
    { "id": "4", "text": "Updating software as soon as patches arrive", "category": "safe", "hint": "Patches fix known security holes." },
    { "id": "5", "text": "Clicking 'Unsubscribe' in a spam email", "category": "risk", "hint": "Often confirms your email is active to spammers." },
    { "id": "6", "text": "Using a unique passphrase for each service", "category": "safe", "hint": "Isolation prevents credential stuffing." },
]

# 4. Mock Protocol Match Game Pairs
PROTOCOL_MATCH_DATA = [
    { "protocol": "HTTPS", "port": "Port 443" },
    { "protocol": "SSH", "port": "Port 22" },
    { "protocol": "FTP", "port": "Port 21" },
]

# 5. Mock Quick Quiz Questions
QUICK_QUIZ_DATA = [
    { "question": "What is the first step in a phishing attack?", "options": ["Clicking a suspicious link", "Receiving a deceptive email", "Downloading malware", "Sharing your password"], "correctIndex": 1, "explanation": "Phishing starts with the attacker sending a deceptive email designed to look legitimate." },
    { "question": "Which password is the most secure?", "options": ["password123", "MyDog'sName", "Tr0ub4dor&3", "j7$kL9!mNq2@xW"], "correctIndex": 3, "explanation": "Long, random passwords with mixed characters are the strongest against brute-force attacks." },
    { "question": "What does 2FA stand for?", "options": ["Two-Factor Authentication", "Two-File Authorization", "Two-Form Access", "Two-Firewall Application"], "correctIndex": 0, "explanation": "Two-Factor Authentication adds a second layer of verification beyond just a password." },
]

# 6. Mock Chat Simulator Scenario
CHAT_SCENARIO_DATA = {
    "start": {
        "attackerMessage": "Hi! This is Sarah from HR. We're having some trouble with the payroll system for your department. Could you help me verify your employee ID and just the last 4 digits of your SSN? I want to make sure you get paid on time!",
        "options": [
            { "text": "Sure, my ID is EMP442 and last 4 are 8821.", "isSecure": False, "feedback": "Never share sensitive identifiers over unsolicited chat, even if they mention payroll!" },
            { "text": "Hi Sarah, can you tell me your official employee extension so I can call you back via the internal directory?", "isSecure": True, "feedback": "Great move! Verifying the identity through official channels is a top security practice.", "nextStageId": "verify" },
            { "text": "I'm not comfortable sharing that here. I'll drop by the HR office later today to check.", "isSecure": True, "feedback": "Excellent! Choosing a secure, physical location for sensitive matters is very safe.", "nextStageId": "office" }
        ]
    },
    "verify": {
        "attackerMessage": "Oh, I'm actually working remotely today and my extension is being forwarded. It's really urgent though, the payroll batch closes in 10 minutes!",
        "options": [
            { "text": "Okay, since it's urgent: 8821.", "isSecure": False, "feedback": "Urgency is a classic social engineering trick. Don't let pressure bypass your security protocols." },
            { "text": "I understand, but company policy requires me to verify these details through our secure portal. I'll check it there.", "isSecure": True, "feedback": "Perfect. Relying on established secure portals instead of chat is exactly what you should do.", "nextStageId": "success" }
        ]
    },
    "office": {
        "attackerMessage": "Actually, there's a big meeting in HR all afternoon. If you don't do it now, your paycheck might be delayed until next week! Are you sure?",
        "options": [
            { "text": "Fine, I don't want to miss my pay. It's 8821.", "isSecure": False, "feedback": "The attacker used a 'paycheck delay' threat to scare you. Stay firm!" },
            { "text": "Yes, I'm sure. I'll wait to speak with my manager first.", "isSecure": True, "feedback": "Solid choice. Involving management adds an extra layer of verification.", "nextStageId": "success" }
        ]
    }
}

# 7. Mock Dashboards Data
DASHBOARD_DATA = {
    "learner": {
        "path_nodes": [
            { "id": 1, "title": "Phishing 101", "status": "completed", "type": "lesson" },
            { "id": 2, "title": "Password Security", "status": "completed", "type": "quiz" },
            { "id": 3, "title": "Social Engineering", "status": "current", "type": "interactive" },
            { "id": 4, "title": "Device Protection", "status": "locked", "type": "lesson" },
            { "id": 5, "title": "Final Assessment", "status": "locked", "type": "quiz" },
        ],
        "continue_courses": [
            { "id": 101, "title": "Data Privacy Essentials", "progress": 45, "lessonsLeft": 3 },
            { "id": 102, "title": "Incident Response", "progress": 15, "lessonsLeft": 8 },
        ]
    },
    "admin": {
        "team": [
            { "id": 1, "name": "Alice Johnson", "role": "Frontend Dev", "progress": 85, "status": "On Track", "avatar": "https://i.pravatar.cc/150?u=1", "coursesCompleted": 4 },
            { "id": 2, "name": "Bob Smith", "role": "Backend Dev", "progress": 40, "status": "Overdue", "avatar": "https://i.pravatar.cc/150?u=2", "coursesCompleted": 2 },
            { "id": 3, "name": "Charlie Davis", "role": "Designer", "progress": 100, "status": "Completed", "avatar": "https://i.pravatar.cc/150?u=3", "coursesCompleted": 6 },
            { "id": 4, "name": "Diana Prince", "role": "Product Manager", "progress": 60, "status": "On Track", "avatar": "https://i.pravatar.cc/150?u=4", "coursesCompleted": 3 },
            { "id": 5, "name": "Evan Wright", "role": "QA Engineer", "progress": 15, "status": "At Risk", "avatar": "https://i.pravatar.cc/150?u=5", "coursesCompleted": 1 },
        ],
        "activities": [
            { "action": "Charlie Davis completed", "course": "Cybersecurity Awareness", "time": "2 hours ago", "color": "emerald" },
            { "action": "Alice Johnson started", "course": "Project Management 101", "time": "4 hours ago", "color": "indigo" },
            { "action": "Diana Prince earned badge", "course": "Week Warrior", "time": "6 hours ago", "color": "amber" },
        ]
    }
}

# 8. Mock Content Reader Data
CONTENT_READER_DATA = [
    {
        "title": "What is Social Engineering?",
        "content": "Social engineering is a manipulation technique that exploits human psychology rather than technical vulnerabilities. Attackers use deception to trick individuals into revealing confidential information, granting unauthorized access, or performing actions that compromise security.\n\nUnlike traditional hacking, social engineering targets the weakest link in any security system — the human element. Even the most sophisticated technical defenses can be bypassed by a well-crafted social engineering attack.\n\n**Key Principle:** Attackers exploit trust, fear, urgency, and authority to manipulate their targets. Understanding these psychological triggers is the first step in defending against them."
    },
    {
        "title": "Common Attack Vectors",
        "content": "**Phishing** — The most prevalent form of social engineering. Attackers send fraudulent emails that appear to come from legitimate sources. These emails often contain malicious links or attachments designed to steal credentials or install malware.\n\n**Pretexting** — The attacker creates a fabricated scenario (pretext) to engage the victim. For example, posing as an IT technician who needs the employee's password to \"fix an issue.\"\n\n**Baiting** — Similar to phishing, but involves offering something enticing. This could be a USB drive labeled \"Salary Information\" left in a parking lot, or a free download that contains malware.\n\n**Tailgating** — An unauthorized person follows an authorized person into a restricted area. This exploits politeness and the tendency to hold doors open for others."
    },
    {
        "title": "How to Protect Yourself",
        "content": "**Verify Before Trusting** — Always verify the identity of someone requesting sensitive information, even if they claim to be from IT, management, or a known vendor. Use a separate communication channel to confirm.\n\n**Think Before You Click** — Hover over links before clicking to check the actual URL. Be suspicious of unexpected emails, especially those creating urgency or offering something too good to be true.\n\n**Report Suspicious Activity** — If something feels off, report it to your security team immediately. It's better to report a false positive than to ignore a real threat. Most organizations have a dedicated channel for reporting potential security incidents.\n\n**Stay Updated** — Social engineering tactics evolve constantly. Regular training and awareness programs help you recognize new attack patterns and stay vigilant. Remember: security is everyone's responsibility."
    }
]

# 9. Mock Phishing Simulator Data
PHISHING_SIMULATOR_DATA = [
    {
        "id": "sender",
        "label": "Suspicious Sender",
        "description": "The email address comes from 'it-support.performova.net' instead of our official 'performova.com' domain.",
        "position": "top-[-10px] left-[60px]"
    },
    {
        "id": "urgency",
        "label": "False Urgency",
        "description": "Phrases like 'Action Required Immediately' or 'Within 24 Hours' are common pressure tactics used in phishing.",
        "position": "top-[120px] left-[20px]"
    },
    {
        "id": "link",
        "label": "Mismatched Link",
        "description": "Hovering shows 'secure-login-portal.co' which doesn't match our official company tools.",
        "position": "bottom-[80px] left-[150px]"
    }
]

async def seed_database(session: AsyncSession):
    # Seed Users
    result = await session.execute(select(User))
    existing_users = result.scalars().all()
    if len(existing_users) <= 1: # Only admin might exist from main.py
        print("Seeding Users...")
        # Get team data to create matching accounts
        team = DASHBOARD_DATA["admin"]["team"]
        
        # Admin User uses main.py, but make sure Learner is seeded
        default_pwd = get_password_hash("admin")
        
        learner = User(email="learner@performova.com", hashed_password=default_pwd, full_name="Valued Trainee", role="Learner")
        session.add(learner)

        for member in team:
            # Create email from name, e.g. Alice Johnson -> alice@performova.com
            email = member["name"].split(" ")[0].lower() + "@performova.com"
            new_user = User(
                email=email,
                hashed_password=default_pwd,
                full_name=member["name"],
                role="Learner",
                department=member["role"],
                streak_days=member["progress"] % 10,
                xp_points=member["coursesCompleted"] * 150
            )
            session.add(new_user)

    # Seed Courses if empty
    result = await session.execute(select(Course))
    existing_courses = result.scalars().all()
    if not existing_courses:
        print("Seeding Courses...")
        for c in COURSES_DATA:
            nc = Course(**c)
            session.add(nc)
    
    # Seed DemoConfigs
    result = await session.execute(select(DemoConfig))
    existing_demos = result.scalars().all()
    if not existing_demos:
        print("Seeding DemoConfigs...")
        demos = [
            ("flashcards", json.dumps(FLASHCARDS_DATA)),
            ("security_sort", json.dumps(SECURITY_SORT_DATA)),
            ("protocol_match", json.dumps(PROTOCOL_MATCH_DATA)),
            ("quick_quiz", json.dumps(QUICK_QUIZ_DATA)),
            ("chat_scenario", json.dumps(CHAT_SCENARIO_DATA)),
            ("dashboard_data", json.dumps(DASHBOARD_DATA)),
            ("content_reader", json.dumps(CONTENT_READER_DATA)),
            ("phishing_simulator", json.dumps(PHISHING_SIMULATOR_DATA))
        ]
        for demo_type, config_json in demos:
            nd = DemoConfig(demo_type=demo_type, config_json=config_json)
            session.add(nd)
            
    await session.commit()
    print("Database seeding completed.")
