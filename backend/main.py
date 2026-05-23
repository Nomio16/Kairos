from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Kairos API",
    description="Backend API for the Mongolian-Korean Language App",
    version="1.0.0"
)

# Configure CORS dynamically for cloud deployment
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import flashcards, ai_generation, classrooms, marathons

@app.get("/")
def read_root():
    return {"message": "Welcome to Kairos API. The backend is running successfully!"}

app.include_router(flashcards.router, prefix="/api/v1")
app.include_router(ai_generation.router, prefix="/api/v1/ai")
app.include_router(classrooms.router, prefix="/api/v1/classrooms")
app.include_router(marathons.router) # NO PREFIX since it contains WebSocket routes
