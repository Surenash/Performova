from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    domain = Column(String, unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")
    departments = relationship("Department", back_populates="organization")
    teams = relationship("Team", back_populates="organization")
    courses = relationship("Course", back_populates="organization")
    learning_paths = relationship("LearningPath", back_populates="organization")
    skills = relationship("Skill", back_populates="organization")
    analytics_snapshots = relationship("AnalyticsSnapshot", back_populates="organization")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    department_head_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)

    organization = relationship("Organization", back_populates="departments")
    head = relationship("User", foreign_keys=[department_head_id], back_populates="managed_departments")
    teams = relationship("Team", back_populates="department", cascade="all, delete")
    users = relationship("User", back_populates="department", foreign_keys="[User.department_id]")

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    team_lead_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)

    organization = relationship("Organization", back_populates="teams")
    department = relationship("Department", back_populates="teams")
    lead = relationship("User", foreign_keys=[team_lead_id], back_populates="managed_teams")
    users = relationship("User", back_populates="team", foreign_keys="[User.team_id]")
    assignments = relationship("CourseAssignment", back_populates="team", cascade="all, delete")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    role = Column(String, default="Learner")  # Admin vs Learner
    
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    streak_days = Column(Integer, default=0)
    xp_points = Column(Integer, default=0)

    # Relationships
    organization = relationship("Organization", back_populates="users")
    department = relationship("Department", back_populates="users", foreign_keys=[department_id])
    team = relationship("Team", back_populates="users", foreign_keys=[team_id])
    manager = relationship("User", remote_side=[id], backref="direct_reports", foreign_keys=[manager_id])
    managed_departments = relationship("Department", foreign_keys="[Department.department_head_id]", back_populates="head")
    managed_teams = relationship("Team", foreign_keys="[Team.team_lead_id]", back_populates="lead")
    skill_links = relationship("UserSkill", back_populates="user", cascade="all, delete")
    
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete")
    assignments = relationship("CourseAssignment", back_populates="user", cascade="all, delete")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete")

class Badge(Base):
    __tablename__ = "badges"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String, nullable=True)
    criteria_type = Column(String, nullable=True) # e.g., 'course_count', 'xp_points'
    criteria_value = Column(Integer, nullable=True)

    users = relationship("UserBadge", back_populates="badge", cascade="all, delete")

class UserBadge(Base):
    __tablename__ = "user_badges"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    awarded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="users")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_published = Column(Boolean, default=False)
    
    # New fields for frontend catalog
    category = Column(String, nullable=True)
    time = Column(Integer, nullable=True) # Minutes
    format = Column(String, nullable=True)
    difficulty = Column(String, nullable=True)
    image = Column(String, nullable=True)
    color = Column(String, nullable=True)
    estimated_cost = Column(Float, default=0.0)

    organization = relationship("Organization", back_populates="courses")
    modules = relationship("Module", back_populates="course", cascade="all, delete")
    progress = relationship("UserProgress", back_populates="course", cascade="all, delete")
    assignments = relationship("CourseAssignment", back_populates="course", cascade="all, delete")
    skill_links = relationship("CourseSkill", back_populates="course", cascade="all, delete")
    prerequisites = relationship("CoursePrerequisite", foreign_keys="[CoursePrerequisite.course_id]", back_populates="course", cascade="all, delete")
    required_by = relationship("CoursePrerequisite", foreign_keys="[CoursePrerequisite.required_course_id]", back_populates="required_course", cascade="all, delete")
    learning_paths = relationship("PathCourse", back_populates="course", cascade="all, delete")
    certificates = relationship("Certificate", back_populates="course", cascade="all, delete")

class CoursePrerequisite(Base):
    __tablename__ = "course_prerequisites"
    __table_args__ = (UniqueConstraint('course_id', 'required_course_id', name='_course_prerequisite_uc'),)
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    required_course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)

    course = relationship("Course", foreign_keys=[course_id], back_populates="prerequisites")
    required_course = relationship("Course", foreign_keys=[required_course_id], back_populates="required_by")

class LearningPath(Base):
    __tablename__ = "learning_paths"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="learning_paths")
    courses = relationship("PathCourse", back_populates="learning_path", cascade="all, delete")
    assignments = relationship("CourseAssignment", back_populates="learning_path")

class PathCourse(Base):
    __tablename__ = "path_courses"
    __table_args__ = (UniqueConstraint('path_id', 'course_id', name='_path_course_uc'),)
    id = Column(Integer, primary_key=True, index=True)
    path_id = Column(Integer, ForeignKey("learning_paths.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    order = Column(Integer, default=0)

    learning_path = relationship("LearningPath", back_populates="courses")
    course = relationship("Course", back_populates="learning_paths")

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    issue_date = Column(DateTime, default=datetime.utcnow)
    expiration_date = Column(DateTime, nullable=True)
    certificate_url = Column(String, nullable=True)

    user = relationship("User", back_populates="certificates")
    course = relationship("Course", back_populates="certificates")

class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete")

class DemoConfig(Base):
    """Generic table for all interactive demos to store varying structured data."""
    __tablename__ = "demo_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    demo_type = Column(String, unique=True, index=True, nullable=False) # e.g., 'flashcards', 'quiz', 'security_sort'
    config_json = Column(Text, nullable=False) # Stores the actual JSON array/object

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    title = Column(String, index=True, nullable=False)
    type = Column(String, default="lesson") # "lesson", "quiz"
    content = Column(Text) # Could be markdown, HTML, or raw text
    video_url = Column(String, nullable=True)
    order = Column(Integer, default=0)
    estimated_time = Column(Integer, nullable=True) # Minutes

    module = relationship("Module", back_populates="lessons")
    progress = relationship("UserProgress", back_populates="lesson", cascade="all, delete")
    questions = relationship("Question", back_populates="lesson", cascade="all, delete")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String, nullable=False) # e.g. "multiple_choice", "true_false", "drag_drop_sort"
    question_text = Column(Text, nullable=False)
    # Storing configurations and answers as JSON string to support various types dynamically
    config = Column(Text, nullable=False)
    order = Column(Integer, default=0)

    lesson = relationship("Lesson", back_populates="questions")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    is_completed = Column(Boolean, default=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="progress")
    course = relationship("Course", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")

class CourseAssignment(Base):
    __tablename__ = "course_assignments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id"), nullable=True)
    assigned_date = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=True)
    is_mandatory = Column(Boolean, default=False)
    status = Column(String, default="assigned") # assigned, in_progress, completed, overdue

    user = relationship("User", back_populates="assignments")
    team = relationship("Team", back_populates="assignments")
    course = relationship("Course", back_populates="assignments")
    learning_path = relationship("LearningPath", back_populates="assignments")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_type = Column(String, nullable=False) # login, lesson_completed, quiz_passed, etc.
    xp_awarded = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activity_logs")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_bot = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")

# --- BI & Analytics Models ---

class QuizAttempt(Base):
    """Tracks a user's attempt at passing a quiz lesson."""
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    score = Column(Integer, default=0)
    max_score = Column(Integer, default=0)
    passed = Column(Boolean, default=False)
    attempt_number = Column(Integer, default=1)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User")
    lesson = relationship("Lesson")
    responses = relationship("QuestionResponse", back_populates="attempt", cascade="all, delete")

class QuestionResponse(Base):
    """Tracks granular responses to individual questions within an attempt."""
    __tablename__ = "question_responses"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    response_time_seconds = Column(Integer, nullable=True) # How long did they think?
    selected_option = Column(Text, nullable=True) # JSON or string of their exact answer

    attempt = relationship("QuizAttempt", back_populates="responses")
    question = relationship("Question")

class UserSession(Base):
    """Tracks login history and platform engagement."""
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    login_at = Column(DateTime, default=datetime.utcnow)
    logout_at = Column(DateTime, nullable=True)
    ip_address = Column(String, nullable=True)
    device_info = Column(String, nullable=True)

    user = relationship("User")

class CourseFeedback(Base):
    """Stores qualitative CSAT and NPS data for courses."""
    __tablename__ = "course_feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    rating = Column(Integer, nullable=False) # e.g., 1-5 stars
    comments = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    course = relationship("Course")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)

    organization = relationship("Organization", back_populates="skills")
    course_links = relationship("CourseSkill", back_populates="skill", cascade="all, delete")
    user_links = relationship("UserSkill", back_populates="skill", cascade="all, delete")

class CourseSkill(Base):
    __tablename__ = "course_skills"
    __table_args__ = (UniqueConstraint('course_id', 'skill_id', name='_course_skill_uc'),)
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    weight = Column(Float, default=1.0) # Importance of this skill in the course

    course = relationship("Course", back_populates="skill_links")
    skill = relationship("Skill", back_populates="course_links")

class UserSkill(Base):
    __tablename__ = "user_skills"
    __table_args__ = (UniqueConstraint('user_id', 'skill_id', name='_user_skill_uc'),)
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency_level = Column(Integer, default=1) # e.g., 1-5
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="skill_links")
    skill = relationship("Skill", back_populates="user_links")

class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    metric_name = Column(String, index=True, nullable=False)
    metric_value = Column(Float, nullable=False)
    dimension = Column(String, nullable=True) # e.g., 'department', 'team', 'global'
    timestamp = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="analytics_snapshots")
