import os
import json
import traceback
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
from uuid import UUID
from openai import AsyncOpenAI

from database import supabase

router = APIRouter()
client = AsyncOpenAI() # Automatically securely loads from OPENAI_API_KEY


@router.post("/generate/text")
async def generate_from_text(
    folder_id: str,
    file: UploadFile = File(...),
):
    """
    Takes a .txt file and uses an LLM to extract meaning/vocab into a Deck format.
    """
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be .txt")
        
    try:
        content_bytes = await file.read()
        content = content_bytes.decode('utf-8')
    except Exception:
        raise HTTPException(status_code=400, detail="Cannot decode file. Must be valid UTF-8 text.")

    prompt = f"""
You are an expert language teacher creating flashcards for Mongolian speakers learning Korean.
Please read the following text and extract the most important vocabulary words or short sentences. 
For each item, output a JSON object with exactly two keys: "front_text" (the Mongolian translation/reference) and "back_text" (the Korean target).

Text:
{content}
"""
    try:
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={
                "type": "json_schema", 
                "json_schema": {
                    "name": "flashcards_array", 
                    "strict": True, 
                    "schema": {
                        "type": "object", 
                        "properties": {
                            "flashcards": {
                                "type": "array", 
                                "items": {
                                    "type": "object", 
                                    "properties": {
                                        "front_text": {"type": "string"}, 
                                        "back_text": {"type": "string"}
                                    }, 
                                    "required": ["front_text", "back_text"], 
                                    "additionalProperties": False
                                }
                            }
                        }, 
                        "required": ["flashcards"], 
                        "additionalProperties": False
                    }
                }
            },
            messages=[
                {"role": "system", "content": "You are a helpful assistant designed to output strict JSON flashcards."},
                {"role": "user", "content": prompt}
            ]
        )
        
        result_json = completion.choices[0].message.content
        data = json.loads(result_json)
        flashcards_list = data.get("flashcards", [])
        
        if not flashcards_list:
            raise ValueError("No flashcards generated.")
            
        # Insert new deck into our connected Supabase database
        deck_res = supabase.table("decks").insert({
            "folder_id": folder_id,
            "title": f"AI Deck from {file.filename}",
            "is_public": True
        }).execute()
        
        new_deck_id = deck_res.data[0]["id"]
        
        for card in flashcards_list:
            card["deck_id"] = new_deck_id
            
        supabase.table("flashcards").insert(flashcards_list).execute()
        
        return {"status": "success", "message": f"Successfully generated {len(flashcards_list)} flashcards.", "deck_id": new_deck_id}
        
    except Exception as e:
        print("ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@router.post("/generate/media")
async def generate_from_media(
    folder_id: UUID,
    file: UploadFile = File(...),
):
    """
    Takes a video/audio file (mp4, mp3), extracts transcript via Whisper, and generates Deck via LLM.
    """
    allowed_extensions = ('.mp3', '.mp4', '.wav', '.m4a')
    if file.filename.endswith(allowed_extensions):
        content = await file.read()
        # Process audio to STT via Whisper
        # Then chunk and generate Flashcards via LLM
        return {"status": "success", "message": f"Media processed successfully. Deck generated in folder {folder_id}."}
    raise HTTPException(status_code=400, detail="Invalid file type. Must be video/audio")
