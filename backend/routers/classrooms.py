from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from database import supabase
import random
import string

router = APIRouter()

class ClassroomCreate(BaseModel):
    name: str

class ClassroomJoin(BaseModel):
    join_code: str

@router.post("/classrooms")
async def create_classroom(classroom: ClassroomCreate):
    data = classroom.dict()
    # Mocking user_id for Agile
    data["owner_id"] = "00000000-0000-0000-0000-000000000000"
    data["join_code"] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    response = supabase.table("classrooms").insert(data).execute()
    return response.data[0]

@router.post("/classrooms/join")
async def join_classroom(join_req: ClassroomJoin):
    # Lookup
    classroom = supabase.table("classrooms").select("*").eq("join_code", join_req.join_code).execute()
    if not classroom.data:
        raise HTTPException(status_code=404, detail="Classroom not found")
        
    class_id = classroom.data[0]["id"]
    join_data = {
        "classroom_id": class_id,
        "user_id": "00000000-0000-0000-0000-000000000000",
        "role": "student"
    }
    
    response = supabase.table("classroom_members").insert(join_data).execute()
    return {"status": "success", "message": "Joined classroom!"}
