from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class FolderCreate(BaseModel):
    title: str
    description: Optional[str] = None
    
class FolderResponse(FolderCreate):
    id: UUID
    owner_id: UUID
    created_at: datetime

class DeckCreate(BaseModel):
    title: str
    description: Optional[str] = None
    folder_id: Optional[UUID] = None
    is_public: bool = False

class DeckResponse(DeckCreate):
    id: UUID
    owner_id: UUID
    created_at: datetime

class FlashcardCreate(BaseModel):
    deck_id: UUID
    front_text: str
    back_text: str
    front_media_url: Optional[str] = None
    back_media_url: Optional[str] = None

class FlashcardResponse(FlashcardCreate):
    id: UUID
    created_at: datetime
