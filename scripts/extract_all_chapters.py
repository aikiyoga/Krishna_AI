#!/usr/bin/env python3
"""
Batch extractor for all Bhagavad Gita chapters 4-18.
This script runs the extract_gita_simple.py script for each chapter.
"""

import subprocess
import sys
import os
from pathlib import Path

def extract_chapter(chapter_num):
    """Extract a single chapter using the main script."""
    print(f"\n{'='*60}")
    print(f"EXTRACTING CHAPTER {chapter_num}")
    print(f"{'='*60}")
    
    try:
        # Run the extraction script
        result = subprocess.run([
            sys.executable, 'extract_gita_simple.py', str(chapter_num)
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print(f"✅ Chapter {chapter_num} extracted successfully")
            print(result.stdout)
            return True
        else:
            print(f"❌ Chapter {chapter_num} failed with error:")
            print(result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print(f"❌ Chapter {chapter_num} timed out")
        return False
    except Exception as e:
        print(f"❌ Chapter {chapter_num} failed with exception: {e}")
        return False

def main():
    """Extract all chapters from 4 to 18."""
    print("Bhagavad Gita Chapter Extractor")
    print("Extracting chapters 4-18...")
    
    # Check if the main script exists
    if not Path('extract_gita_simple.py').exists():
        print("❌ Error: extract_gita_simple.py not found in current directory")
        return 1
    
    # Track results
    successful = []
    failed = []
    
    # Extract each chapter
    for chapter in range(4, 19):  # 4 to 18 inclusive
        if extract_chapter(chapter):
            successful.append(chapter)
        else:
            failed.append(chapter)
    
    # Print summary
    print(f"\n{'='*60}")
    print("EXTRACTION SUMMARY")
    print(f"{'='*60}")
    print(f"✅ Successfully extracted: {len(successful)} chapters")
    if successful:
        print(f"   Chapters: {', '.join(map(str, successful))}")
    
    if failed:
        print(f"❌ Failed to extract: {len(failed)} chapters")
        print(f"   Chapters: {', '.join(map(str, failed))}")
    
    # List generated files
    print(f"\n📁 Generated files:")
    for chapter in successful:
        filename = f"gita_ch{chapter:02d}_combined.json"
        if Path(filename).exists():
            size = Path(filename).stat().st_size
            print(f"   {filename} ({size:,} bytes)")
    
    print(f"\nTotal chapters processed: {len(successful) + len(failed)}")
    
    return 0 if not failed else 1

if __name__ == "__main__":
    exit(main())
