#!/usr/bin/env python3
"""
Generate a summary of all extracted Bhagavad Gita chapters.
Shows statistics and creates a combined index of all chapters.
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any

def load_chapter_data(chapter: int) -> Dict[str, Any]:
    """Load data for a specific chapter."""
    filename = f"gita_ch{chapter:02d}_combined.json"
    
    if not Path(filename).exists():
        return None
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return {
            'chapter': chapter,
            'filename': filename,
            'verse_count': len(data),
            'file_size': Path(filename).stat().st_size,
            'verses': data
        }
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return None

def generate_summary():
    """Generate a comprehensive summary of all chapters."""
    
    print("Bhagavad Gita Chapter Summary")
    print("=" * 60)
    
    all_chapters = []
    total_verses = 0
    total_size = 0
    
    # Check chapters 2-18 (we have 2 and 3 from earlier, plus 4-18)
    for chapter in range(2, 19):
        chapter_data = load_chapter_data(chapter)
        if chapter_data:
            all_chapters.append(chapter_data)
            total_verses += chapter_data['verse_count']
            total_size += chapter_data['file_size']
    
    # Print individual chapter statistics
    print(f"{'Chapter':<8} {'Verses':<8} {'File Size':<12} {'Status'}")
    print("-" * 40)
    
    for chapter in range(2, 19):
        chapter_data = next((c for c in all_chapters if c['chapter'] == chapter), None)
        if chapter_data:
            size_kb = chapter_data['file_size'] / 1024
            print(f"{chapter:<8} {chapter_data['verse_count']:<8} {size_kb:>8.1f} KB   ✅ Available")
        else:
            print(f"{chapter:<8} {'N/A':<8} {'N/A':<12} ❌ Missing")
    
    print("-" * 40)
    print(f"{'Total':<8} {total_verses:<8} {total_size/1024:>8.1f} KB")
    print()
    
    # Print summary statistics
    print("Summary Statistics:")
    print(f"  Available chapters: {len(all_chapters)}")
    print(f"  Total verses: {total_verses:,}")
    print(f"  Total file size: {total_size/1024/1024:.2f} MB")
    print(f"  Average verses per chapter: {total_verses/len(all_chapters):.1f}")
    print()
    
    # Find chapters with most/least verses
    if all_chapters:
        max_chapter = max(all_chapters, key=lambda x: x['verse_count'])
        min_chapter = min(all_chapters, key=lambda x: x['verse_count'])
        
        print("Chapter Statistics:")
        print(f"  Longest chapter: Chapter {max_chapter['chapter']} ({max_chapter['verse_count']} verses)")
        print(f"  Shortest chapter: Chapter {min_chapter['chapter']} ({min_chapter['verse_count']} verses)")
        print()
    
    # Create a master index file
    create_master_index(all_chapters)
    
    return all_chapters

def create_master_index(chapters: List[Dict[str, Any]]):
    """Create a master index file with all chapters."""
    
    master_index = {
        "title": "Bhagavad Gita - Complete Index",
        "description": "Combined index of all extracted Bhagavad Gita chapters",
        "total_chapters": len(chapters),
        "total_verses": sum(c['verse_count'] for c in chapters),
        "chapters": []
    }
    
    for chapter_data in sorted(chapters, key=lambda x: x['chapter']):
        chapter_info = {
            "chapter": chapter_data['chapter'],
            "verse_count": chapter_data['verse_count'],
            "filename": chapter_data['filename'],
            "file_size_bytes": chapter_data['file_size'],
            "first_verse": chapter_data['verses'][0] if chapter_data['verses'] else None,
            "last_verse": chapter_data['verses'][-1] if chapter_data['verses'] else None
        }
        master_index["chapters"].append(chapter_info)
    
    # Save master index
    with open('bhagavad_gita_master_index.json', 'w', encoding='utf-8') as f:
        json.dump(master_index, f, ensure_ascii=False, indent=2)
    
    print("Master Index:")
    print(f"  Created: bhagavad_gita_master_index.json")
    print(f"  Contains: {len(chapters)} chapters, {sum(c['verse_count'] for c in chapters)} verses")
    print()

def show_sample_verses(chapters: List[Dict[str, Any]], num_samples: int = 3):
    """Show sample verses from different chapters."""
    
    print(f"Sample Verses (from {num_samples} chapters):")
    print("=" * 60)
    
    # Show samples from first, middle, and last chapters
    sample_chapters = [
        chapters[0],  # First
        chapters[len(chapters)//2],  # Middle
        chapters[-1]  # Last
    ]
    
    for chapter_data in sample_chapters[:num_samples]:
        chapter = chapter_data['chapter']
        verses = chapter_data['verses']
        
        if verses:
            verse = verses[0]  # First verse of the chapter
            print(f"\nChapter {chapter}, Verse {verse['verse']}:")
            print(f"Sanskrit: {verse['text'][:100]}...")
            print(f"English:  {verse['translation'][:100]}...")
            print(f"Japanese: {verse['translation_jp'][:100]}...")

def main():
    """Main function."""
    try:
        chapters = generate_summary()
        
        if chapters:
            show_sample_verses(chapters)
        else:
            print("No chapter files found. Please run the extraction scripts first.")
            return 1
        
        return 0
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
