from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, case, text
from backend.database import get_db
from backend.models import (
    User, Course, UserProgress, Skill, UserSkill, CourseSkill, 
    AnalyticsSnapshot, CourseAssignment, Organization
)
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/analytics/skills", tags=["Analytics"])
async def get_skill_analytics(db: AsyncSession = Depends(get_db)):
    """Returns proficiency distribution across skill categories."""
    # Group by skill name/category and calculate average proficiency
    query = (
        select(
            Skill.name,
            Skill.category,
            func.avg(UserSkill.proficiency_level).label("avg_proficiency"),
            func.count(UserSkill.user_id).label("user_count")
        )
        .join(UserSkill, Skill.id == UserSkill.skill_id)
        .group_by(Skill.name, Skill.category)
    )
    
    result = await db.execute(query)
    data = []
    for row in result:
        data.append({
            "skill": row.name,
            "category": row.category,
            "proficiency": round(float(row.avg_proficiency), 2) if row.avg_proficiency else 0,
            "users": row.user_count
        })
    
    # If no data, return mock for UI demo
    if not data:
        return [
            {"skill": "Data Privacy", "category": "Compliance", "proficiency": 3.8, "users": 45},
            {"skill": "Network Security", "category": "Technical", "proficiency": 2.5, "users": 32},
            {"skill": "Phishing Awareness", "category": "Security", "proficiency": 4.2, "users": 120},
            {"skill": "Leadership", "category": "Soft Skills", "proficiency": 3.1, "users": 15},
        ]
    return data

@router.get("/analytics/roi", tags=["Analytics"])
async def get_roi_analytics(db: AsyncSession = Depends(get_db)):
    """Calculates ROI by comparing course costs to completion rates."""
    query = (
        select(
            Course.title,
            Course.estimated_cost,
            func.count(UserProgress.id).filter(UserProgress.is_completed == True).label("completions")
        )
        .outerjoin(UserProgress, Course.id == UserProgress.course_id)
        .group_by(Course.id, Course.title, Course.estimated_cost)
    )
    
    result = await db.execute(query)
    data = []
    for row in result:
        cost_per_completion = 0
        if row.completions > 0:
            cost_per_completion = (row.estimated_cost or 0) / row.completions
            
        data.append({
            "course": row.title,
            "investment": row.estimated_cost or 0,
            "completions": row.completions,
            "cost_per_learner": round(cost_per_completion, 2)
        })
        
    if not data:
        return [
            {"course": "Cybersecurity 101", "investment": 5000, "completions": 150, "cost_per_learner": 33.33},
            {"course": "Advanced Python", "investment": 12000, "completions": 40, "cost_per_learner": 300.00},
            {"course": "Compliance 2024", "investment": 2000, "completions": 300, "cost_per_learner": 6.67},
        ]
    return data

@router.get("/analytics/velocity", tags=["Analytics"])
async def get_velocity_analytics(db: AsyncSession = Depends(get_db)):
    """Tracks time-to-mastery (velocity) for courses."""
    # We measure the difference between started_at and completed_at in UserProgress
    # Note: SQLite doesn't have a standard interval, so we'll use julianday for subtraction
    
    # Check if we are on SQLite or Postgres (simplified check)
    from backend.database import DATABASE_URL
    is_sqlite = DATABASE_URL.startswith("sqlite")
    
    if is_sqlite:
        velocity_expr = func.avg(func.julianday(UserProgress.completed_at) - func.julianday(UserProgress.started_at))
    else:
        velocity_expr = func.avg(UserProgress.completed_at - UserProgress.started_at)

    query = (
        select(
            Course.title,
            velocity_expr.label("avg_days")
        )
        .join(UserProgress, Course.id == UserProgress.course_id)
        .filter(UserProgress.is_completed == True)
        .filter(UserProgress.completed_at != None)
        .filter(UserProgress.started_at != None)
        .group_by(Course.title)
    )
    
    result = await db.execute(query)
    data = []
    for row in result:
        data.append({
            "course": row.title,
            "avg_days_to_complete": round(float(row.avg_days), 1) if row.avg_days else 0
        })
        
    if not data:
        return [
            {"course": "Cybersecurity 101", "avg_days_to_complete": 4.5},
            {"course": "Advanced Python", "avg_days_to_complete": 14.2},
            {"course": "Compliance 2024", "avg_days_to_complete": 1.5},
        ]
    return data

@router.get("/analytics/snapshots", tags=["Analytics"])
async def get_snapshots(db: AsyncSession = Depends(get_db)):
    """Returns the latest pre-aggregated snapshots."""
    query = (
        select(AnalyticsSnapshot)
        .order_by(AnalyticsSnapshot.timestamp.desc())
        .limit(20)
    )
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/analytics/summary", tags=["Analytics"])
async def get_analytics_summary(db: AsyncSession = Depends(get_db)):
    """High level KPIs for the dashboard."""
    # 1. Total Investment
    total_investment = (await db.execute(select(func.sum(Course.estimated_cost)))).scalar() or 0
    
    # 2. Global Completion Rate
    total_assignments = (await db.execute(select(func.count(CourseAssignment.id)))).scalar() or 1 # Avoid div by zero
    completed_assignments = (await db.execute(select(func.count(CourseAssignment.id)).filter(CourseAssignment.status == "completed"))).scalar() or 0
    completion_rate = (completed_assignments / total_assignments) * 100
    
    # 3. Skills Gained (Count of UserSkills with level >= 3)
    skills_mastered = (await db.execute(select(func.count(UserSkill.id)).filter(UserSkill.proficiency_level >= 3))).scalar() or 0
    
    return {
        "total_investment": round(total_investment, 2),
        "completion_rate": round(completion_rate, 1),
        "skills_mastered": skills_mastered,
        "active_learners": (await db.execute(select(func.count(User.id)).filter(User.is_active == True))).scalar() or 0
    }
