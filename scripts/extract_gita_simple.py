#!/usr/bin/env python3
"""
Universal extractor for Bhagavad Gita chapters.
Extracts and combines verse data from gita_chXX.ts and gita_chXX_insights.ts files.
Creates a JSON file with combined verse data.

Usage: python3 extract_gita_simple.py <chapter_number>
Example: python3 extract_gita_simple.py 4
"""

import json
import re
import sys
import argparse
from typing import Dict, List, Any

def extract_verses_simple(chapter: int) -> List[Dict[str, Any]]:
    """Extract verses from gita_chXX.ts using a simple approach."""

    # Format chapter number with leading zero if needed
    chapter_str = f"{chapter:02d}"

    # Read the file
    filename = f'src/services/gita_ch{chapter_str}.ts'
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the array content between the brackets (try different formats)
    start_markers = [
        f'export const gita_ch{chapter_str} : Verse[] = [',
        f'export const gita_ch{chapter_str}: Verse[] = ['
    ]
    end_marker = '];'

    start_idx = -1
    start_marker_used = None
    for marker in start_markers:
        start_idx = content.find(marker)
        if start_idx != -1:
            start_marker_used = marker
            break

    if start_idx == -1:
        raise ValueError(f"Could not find start of gita_ch{chapter_str} array")

    start_idx += len(start_marker_used)
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        raise ValueError(f"Could not find end of gita_ch{chapter_str} array")
    
    array_content = content[start_idx:end_idx].strip()
    
    # Split by verse objects (look for patterns like "  {")
    verse_objects = []
    current_obj = ""
    brace_count = 0
    
    for line in array_content.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        current_obj += line + '\n'
        
        # Count braces to find complete objects
        brace_count += line.count('{') - line.count('}')
        
        if brace_count == 0 and current_obj.strip():
            verse_objects.append(current_obj.strip().rstrip(','))
            current_obj = ""
    
    # Parse each verse object
    verses = []
    for obj_str in verse_objects:
        if not obj_str.strip():
            continue
            
        verse = parse_verse_object(obj_str)
        if verse:
            verses.append(verse)
    
    return verses

def parse_verse_object(obj_str: str) -> Dict[str, Any]:
    """Parse a single verse object string."""
    
    # Remove outer braces
    obj_str = obj_str.strip()
    if obj_str.startswith('{'):
        obj_str = obj_str[1:]
    if obj_str.endswith('}'):
        obj_str = obj_str[:-1]
    
    verse = {}
    
    # Extract chapter (handle both quoted and unquoted)
    chapter_match = re.search(r'"?chapter"?:\s*(\d+)', obj_str)
    if chapter_match:
        verse['chapter'] = int(chapter_match.group(1))

    # Extract verse number (handle both quoted and unquoted)
    verse_match = re.search(r'"?verse"?:\s*(\d+)', obj_str)
    if verse_match:
        verse['verse'] = int(verse_match.group(1))

    # Extract importance (handle both quoted and unquoted)
    importance_match = re.search(r'"?importance"?:\s*(\d+)', obj_str)
    if importance_match:
        verse['importance'] = int(importance_match.group(1))
    
    # Extract text (Sanskrit)
    text_match = re.search(r'text:\s*"([^"]*)"', obj_str, re.DOTALL)
    if text_match:
        verse['text'] = text_match.group(1)
    
    # Extract translation
    translation_match = re.search(r'translation:\s*"([^"]*)"', obj_str, re.DOTALL)
    if translation_match:
        verse['translation'] = translation_match.group(1)
    
    # Extract Japanese translation
    translation_jp_match = re.search(r'translation_jp:\s*"([^"]*)"', obj_str, re.DOTALL)
    if translation_jp_match:
        verse['translation_jp'] = translation_jp_match.group(1)
    
    return verse

def extract_insights_simple(chapter: int) -> List[Dict[str, Any]]:
    """Extract insights from gita_chXX_insights.ts using a simple approach."""

    # Format chapter number with leading zero if needed
    chapter_str = f"{chapter:02d}"

    # Read the file
    filename = f'src/services/gita_ch{chapter_str}_insights.ts'
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the array content between the brackets (try different formats)
    start_markers = [
        f'export const gita_ch{chapter_str}_insights: VerseWithInsights[] =',
        f'export const gita_ch{chapter_str}_insights : VerseWithInsights[] ='
    ]
    end_marker = '];'

    start_idx = -1
    for marker in start_markers:
        start_idx = content.find(marker)
        if start_idx != -1:
            break

    if start_idx == -1:
        raise ValueError(f"Could not find start of gita_ch{chapter_str}_insights array")

    # Find the opening bracket
    bracket_idx = content.find('[', start_idx)
    if bracket_idx == -1:
        raise ValueError("Could not find opening bracket")

    start_idx = bracket_idx + 1
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        raise ValueError(f"Could not find end of gita_ch{chapter_str}_insights array")
    
    array_content = content[start_idx:end_idx].strip()
    
    # Split by insight objects
    insight_objects = []
    current_obj = ""
    brace_count = 0
    
    for line in array_content.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        current_obj += line + '\n'
        
        # Count braces to find complete objects
        brace_count += line.count('{') - line.count('}')
        
        if brace_count == 0 and current_obj.strip():
            insight_objects.append(current_obj.strip().rstrip(','))
            current_obj = ""
    
    # Parse each insight object
    insights = []
    for obj_str in insight_objects:
        if not obj_str.strip():
            continue
            
        insight = parse_insight_object(obj_str)
        if insight:
            insights.append(insight)
    
    return insights

def parse_insight_object(obj_str: str) -> Dict[str, Any]:
    """Parse a single insight object string."""
    
    # Remove outer braces
    obj_str = obj_str.strip()
    if obj_str.startswith('{'):
        obj_str = obj_str[1:]
    if obj_str.endswith('}'):
        obj_str = obj_str[:-1]
    
    insight = {}
    
    # Extract chapter (handle both quoted and unquoted)
    chapter_match = re.search(r'"?chapter"?:\s*(\d+)', obj_str)
    if chapter_match:
        insight['chapter'] = int(chapter_match.group(1))

    # Extract verse number (handle both quoted and unquoted)
    verse_match = re.search(r'"?verse"?:\s*(\d+)', obj_str)
    if verse_match:
        insight['verse'] = int(verse_match.group(1))
    
    # Extract insights (English) - handle multiline strings
    insights_match = re.search(r'insights:\s*"(.*?)",\s*insights_jp:', obj_str, re.DOTALL)
    if insights_match:
        insight['insights'] = insights_match.group(1)
    
    # Extract insights_jp (Japanese) - handle multiline strings
    insights_jp_match = re.search(r'insights_jp:\s*"(.*?)"(?:\s*}|\s*$)', obj_str, re.DOTALL)
    if insights_jp_match:
        insight['insights_jp'] = insights_jp_match.group(1)
    
    return insight

def combine_data(verses: List[Dict[str, Any]], insights: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Combine verses with insights."""

    # Create lookup for insights
    insights_lookup = {}
    for i, insight in enumerate(insights):
        if 'chapter' not in insight or 'verse' not in insight:
            print(f"Warning: Insight {i} missing chapter or verse: {insight}")
            continue
        key = (insight['chapter'], insight['verse'])
        insights_lookup[key] = insight
    
    # Combine data
    combined = []
    for i, verse in enumerate(verses):
        if 'chapter' not in verse or 'verse' not in verse:
            print(f"Warning: Verse {i} missing chapter or verse: {verse}")
            continue
        key = (verse['chapter'], verse['verse'])
        
        combined_verse = {
            'chapter': verse['chapter'],
            'verse': verse['verse'],
            'text': verse.get('text', ''),
            'importance': verse.get('importance', 0),
            'translation': verse.get('translation', ''),
            'translation_jp': verse.get('translation_jp', ''),
            'insights': '',
            'insights_jp': ''
        }
        
        if key in insights_lookup:
            insight = insights_lookup[key]
            combined_verse['insights'] = insight.get('insights', '')
            combined_verse['insights_jp'] = insight.get('insights_jp', '')
        
        combined.append(combined_verse)
    
    return combined

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description='Extract and combine Bhagavad Gita chapter data',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 extract_gita_simple.py 4     # Extract Chapter 4
  python3 extract_gita_simple.py 18    # Extract Chapter 18

Supported chapters: 4-18
        """
    )

    parser.add_argument(
        'chapter',
        type=int,
        help='Chapter number to extract (4-18)'
    )

    parser.add_argument(
        '--output',
        '-o',
        help='Output filename (default: gita_chXX_combined.json)'
    )

    args = parser.parse_args()

    # Validate chapter number
    if args.chapter < 1 or args.chapter > 18:
        parser.error("Chapter number must be between 1 and 18")

    return args

def main():
    """Main function."""
    try:
        args = parse_arguments()
        chapter = args.chapter
        chapter_str = f"{chapter:02d}"

        print(f"Extracting verses from gita_ch{chapter_str}.ts...")
        verses = extract_verses_simple(chapter)
        print(f"Extracted {len(verses)} verses")

        print(f"Extracting insights from gita_ch{chapter_str}_insights.ts...")
        insights = extract_insights_simple(chapter)
        print(f"Extracted {len(insights)} insights")

        print("Combining data...")
        combined = combine_data(verses, insights)
        print(f"Combined {len(combined)} entries")

        # Determine output filename
        if args.output:
            output_file = args.output
        else:
            output_file = f'gita_ch{chapter_str}_combined.json'

        # Write to JSON file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(combined, f, ensure_ascii=False, indent=2)

        print(f"Successfully created {output_file}")

        # Show sample
        if combined:
            print(f"\nSample entry from Chapter {chapter}:")
            sample = combined[0]
            for key, value in sample.items():
                if isinstance(value, str) and len(value) > 100:
                    print(f"  {key}: {value[:100]}...")
                else:
                    print(f"  {key}: {value}")

        return 0

    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
        print("Make sure the chapter files exist in src/services/")
        return 1
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit(main())
