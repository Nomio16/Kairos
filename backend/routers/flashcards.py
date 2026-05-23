from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.flashcard_models import FolderCreate, FolderResponse, DeckCreate, DeckResponse, FlashcardCreate, FlashcardResponse
from database import supabase
from uuid import UUID

router = APIRouter()

# Mocking dependancy for user auth for agile setup
async def get_current_user_id() -> str:
    return "00000000-0000-0000-0000-000000000000"

@router.post("/folders", response_model=FolderResponse)
async def create_folder(folder: FolderCreate, user_id: str = Depends(get_current_user_id)):
    data = folder.dict()
    data["owner_id"] = user_id
    response = supabase.table("folders").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create folder")
    return response.data[0]

@router.get("/folders", response_model=List[FolderResponse])
async def get_folders(user_id: str = Depends(get_current_user_id)):
    response = supabase.table("folders").select("*").eq("owner_id", user_id).execute()
    return response.data

@router.post("/decks", response_model=DeckResponse)
async def create_deck(deck: DeckCreate, user_id: str = Depends(get_current_user_id)):
    data = deck.dict()
    data["owner_id"] = user_id
    # Remove nulls if folder_id is missing
    data = {k: v for k, v in data.items() if v is not None}
    response = supabase.table("decks").insert(data).execute()
    return response.data[0]

@router.get("/decks", response_model=List[DeckResponse])
async def get_decks(folder_id: UUID = None, user_id: str = Depends(get_current_user_id)):
    query = supabase.table("decks").select("*").eq("owner_id", user_id)
    if folder_id:
        query = query.eq("folder_id", str(folder_id))
    response = query.execute()
    return response.data

@router.post("/flashcards", response_model=FlashcardResponse)
async def create_flashcard(card: FlashcardCreate):
    # Converting dict manually to remove None values easily
    data = {k: v for k, v in card.dict().items() if v is not None}
    data["deck_id"] = str(data["deck_id"])
    response = supabase.table("flashcards").insert(data).execute()
    return response.data[0]

@router.get("/decks/{deck_id}/flashcards", response_model=List[FlashcardResponse])
async def get_flashcards(deck_id: UUID):
    response = supabase.table("flashcards").select("*").eq("deck_id", str(deck_id)).execute()
    return response.data
