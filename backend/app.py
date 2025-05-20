from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.retrieval import search_verses, get_chapter_summary, search_by_theme, get_daily_wisdom
from backend.generation import generate_krishna_response, personalize_guidance
from backend.memory import ConversationMemory

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory conversation storage (per session)
conversation_memory = ConversationMemory()

@app.post("/ask")
async def ask_krishna(request: Request):
    data = await request.json()
    query = data["query"]
    lang = data.get("lang", "en")
    session_id = data.get("session_id")
    memory = conversation_memory.get(session_id)
    verses = search_verses(query, lang)
    response = generate_krishna_response(query, verses, lang, memory)
    conversation_memory.update(session_id, query, response)
    return {"answer": response}

@app.get("/chapter-summary/{chapter}")
async def chapter_summary(chapter: int, lang: str = "en"):
    return get_chapter_summary(chapter, lang)

@app.get("/theme/{theme}")
async def theme_search(theme: str, lang: str = "en"):
    return search_by_theme(theme, lang)

@app.get("/daily-wisdom")
async def daily_wisdom(lang: str = "en"):
    return get_daily_wisdom(lang)

@app.post("/personal-guidance")
async def personal_guidance(request: Request):
    data = await request.json()
    situation = data["situation"]
    lang = data.get("lang", "en")
    verses = search_verses(situation, lang)
    return {"answer": personalize_guidance(situation, verses, lang)}