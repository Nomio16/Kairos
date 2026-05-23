import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# We expect the user to provide these after creating a Supabase project online
SUPABASE_URL = os.environ.get("SUPABASE_URL", "http://localhost:54321")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "your-anon-key-here")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
