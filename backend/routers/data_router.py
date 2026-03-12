from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.database import get_db
from backend.models import Course, DemoConfig
from typing import List
import json

router = APIRouter()

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
