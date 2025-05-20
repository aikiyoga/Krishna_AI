import json
import random

def load_verses(lang):
    path = f"data/bhagavad-gita/{'english' if lang=='en' else 'japanese'}_translation.json"
    with open(path, "r") as f:
        return json.load(f)

def load_chapter_summaries():
    with open("data/bhagavad-gita/chapter_summaries.json", "r") as f:
        return json.load(f)

def load_themes():
    with open("data/bhagavad-gita/themes.json", "r") as f:
        return json.load(f)

def search_verses(query, lang):
    verses = load_verses(lang)
    # Simple keyword match on text/context/themes
    matches = [
        v for v in verses if any(word in v["text"].lower() or word in v.get("context", "").lower() for word in query.lower().split())
    ]
    return matches

def get_chapter_summary(chapter, lang):
    summaries = load_chapter_summaries()
    for s in summaries:
        if s["chapter"] == chapter:
            return s[f"summary_{lang}"]
    return None

def search_by_theme(theme, lang):
    verses = load_verses(lang)
    return [v for v in verses if theme in v.get("themes", [])]

def get_daily_wisdom(lang):
    verses = load_verses(lang)
    verse = random.choice(verses)
    return {
        "verse": verse["text"],
        "reference": f"{verse['chapter']}:{verse['verse']}",
        "context": verse.get("context", ""),
        "commentary": verse.get("commentary", "")
    }