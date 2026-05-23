import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

def seed():
    print("Seeding database...")
    
    # 1. Insert Folder
    folder_res = supabase.table("folders").insert({
        "title": "Basic Korean Sentences",
        "description": "Essential grammar for Mongolian speakers"
    }).execute()
    
    if not folder_res.data:
        print("Failed to create folder. Ensure RLS is disabled.")
        return
        
    folder_id = folder_res.data[0]["id"]
    print(f"Created Folder: {folder_id}")

    # 2. Insert Deck
    deck_res = supabase.table("decks").insert({
        "folder_id": folder_id,
        "title": "Greetings",
        "is_public": True
    }).execute()
    
    deck_id = deck_res.data[0]["id"]
    print(f"Created Deck: {deck_id}")
    
    # 3. Insert Cards
    supabase.table("flashcards").insert([
        {
            "deck_id": deck_id,
            "front_text": "Сайн байна уу?",
            "back_text": "안녕하세요? (Hello)"
        },
        {
            "deck_id": deck_id,
            "front_text": "Баярлалаа",
            "back_text": "감사합니다 (Thank you)"
        },
        {
            "deck_id": deck_id,
            "front_text": "Баяртай",
            "back_text": "안녕히 가세요 (Goodbye)"
        }
    ]).execute()
    print("Injected flashcards! Run your frontend to test.")

if __name__ == "__main__":
    seed()
