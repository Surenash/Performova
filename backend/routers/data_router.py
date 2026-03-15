from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import get_db
from backend.models import Course, DemoConfig, User
from typing import List
import json
from sqlalchemy import func

router = APIRouter()

@router.get("/dashboard/admin/real-stats")
async def get_admin_dashboard_stats(db: AsyncSession = Depends(get_db)):
    user_count = (await db.execute(select(func.count(User.id)))).scalar()
    course_count = (await db.execute(select(func.count(Course.id)))).scalar()
    result = await db.execute(select(User).limit(10))
    users = result.scalars().all()
    
    # Map users to the structure expected by the frontend
    team_data = []
    for u in users:
        team_data.append({
            "id": u.id,
            "name": u.full_name or u.email,
            "role": u.role,
            "progress": (u.xp_points % 100) if u.xp_points else 0,
            "status": "On Track" if u.is_active else "Inactive",
            "avatar": f"https://i.pravatar.cc/150?u={u.id}",
            "coursesCompleted": (u.xp_points // 100) if u.xp_points else 0
        })

    return {
        "stats": {
            "activeLearners": user_count,
            "avgCompletionTime": "4.2 hrs", # Still mock but UI-ready
            "certificatesEarned": (course_count * 14) if course_count else 0,
            "completionRate": 86
        },
        "team": team_data,
        "activities": [
            { "action": "New system stats", "course": "Database connected", "time": "Just now", "color": "indigo" }
        ]
    }

@router.get("/dashboard/{role}")
async def get_dashboard_data(role: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DemoConfig).filter(DemoConfig.demo_type == "dashboard_data"))
    demo = result.scalars().first()
    if not demo:
        raise HTTPException(status_code=404, detail="Dashboard data not found")
    data = json.loads(demo.config_json)
    if role not in data:
         raise HTTPException(status_code=400, detail="Invalid role")
    return data[role]

@router.get("/demos/{demo_type}")
async def get_demo_config(demo_type: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DemoConfig).filter(DemoConfig.demo_type == demo_type))
    demo = result.scalars().first()
    if not demo:
        raise HTTPException(status_code=404, detail="Demo not found")
    return json.loads(demo.config_json)
