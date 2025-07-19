#!/usr/bin/env python3
"""
Extract and combine data from gita_ch02.ts and gita_ch02_insights.ts
Creates a JSON file with combined verse data.
"""

import json
import re
import os
from typing import Dict, List, Any

def extract_verses(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract verse data from a TypeScript file.

    Args:
        file_path: Path to the TypeScript file

    Returns:
        List of dictionaries containing the verse data
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    verses = []
    current_verse = {}
    in_verse = False
    current_field = None
    current_value = ""

    for line in lines:
        line = line.strip()

        if line.startswith('{'):
            in_verse = True
            current_verse = {}
            continue
        elif line.startswith('}'):
            if in_verse and current_verse:
                verses.append(current_verse)
            in_verse = False
            current_verse = {}
            current_field = None
            current_value = ""
            continue

        if not in_verse:
            continue

        # Parse field: value pairs
        if ':' in line and not current_field:
            parts = line.split(':', 1)
            field = parts[0].strip()
            value = parts[1].strip().rstrip(',')

            if field in ['chapter', 'verse', 'importance']:
                current_verse[field] = int(value)
            elif field in ['text', 'translation', 'translation_jp']:
                if value.startswith('"') and value.endswith('"'):
                    current_verse[field] = value[1:-1]
                else:
                    # Multi-line string
                    current_field = field
                    current_value = value.lstrip('"')
            else:
                current_verse[field] = value.strip('"')
        elif current_field:
            # Continue multi-line string
            line_value = line.rstrip(',')
            if line_value.endswith('"'):
                current_value += " " + line_value[:-1]
                current_verse[current_field] = current_value
                current_field = None
                current_value = ""
            else:
                current_value += " " + line_value

    return verses

def extract_insights(file_path: str) -> List[Dict[str, Any]]:
    """
    Extract insight data from a TypeScript file.

    Args:
        file_path: Path to the TypeScript file

    Returns:
        List of dictionaries containing the insight data
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    insights = []
    current_insight = {}
    in_insight = False
    current_field = None
    current_value = ""

    for line in lines:
        line = line.strip()

        if line.startswith('{'):
            in_insight = True
            current_insight = {}
            continue
        elif line.startswith('}'):
            if in_insight and current_insight:
                insights.append(current_insight)
            in_insight = False
            current_insight = {}
            current_field = None
            current_value = ""
            continue

        if not in_insight:
            continue

        # Parse field: value pairs
        if ':' in line and not current_field:
            parts = line.split(':', 1)
            field = parts[0].strip()
            value = parts[1].strip().rstrip(',')

            if field in ['chapter', 'verse']:
                current_insight[field] = int(value)
            elif field in ['insights', 'insights_jp']:
                if value.startswith('"') and value.endswith('"'):
                    current_insight[field] = value[1:-1]
                else:
                    # Multi-line string
                    current_field = field
                    current_value = value.lstrip('"')
            else:
                current_insight[field] = value.strip('"')
        elif current_field:
            # Continue multi-line string
            line_value = line.rstrip(',')
            if line_value.endswith('"'):
                current_value += " " + line_value[:-1]
                current_insight[current_field] = current_value
                current_field = None
                current_value = ""
            else:
                current_value += " " + line_value

    return insights

def combine_verse_data(verses: List[Dict[str, Any]], insights: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Combine verse data with insights data.

    Args:
        verses: List of verse dictionaries from gita_ch02.ts
        insights: List of insight dictionaries from gita_ch02_insights.ts

    Returns:
        List of combined dictionaries
    """
    # Create a lookup dictionary for insights
    insights_lookup = {}
    for insight in insights:
        key = (insight['chapter'], insight['verse'])
        insights_lookup[key] = insight

    combined = []
    for verse in verses:
        key = (verse['chapter'], verse['verse'])

        # Create combined object
        combined_verse = {
            'chapter': verse['chapter'],
            'verse': verse['verse'],
            'text': verse['text'],
            'importance': verse['importance'],
            'translation': verse['translation'],
            'translation_jp': verse['translation_jp'],
            'insights': '',
            'insights_jp': ''
        }

        # Add insights if available
        if key in insights_lookup:
            insight = insights_lookup[key]
            combined_verse['insights'] = insight['insights']
            combined_verse['insights_jp'] = insight['insights_jp']

        combined.append(combined_verse)

    return combined

def main():
    """Main function to extract and combine the data."""
    try:
        # Extract data from both files
        print("Extracting data from gita_ch02.ts...")
        verses = extract_verses('src/services/gita_ch02.ts')
        print(f"Extracted {len(verses)} verses")

        print("Extracting data from gita_ch02_insights.ts...")
        insights = extract_insights('src/services/gita_ch02_insights.ts')
        print(f"Extracted {len(insights)} insights")

        # Combine the data
        print("Combining verse data with insights...")
        combined_data = combine_verse_data(verses, insights)
        print(f"Combined {len(combined_data)} verses with insights")

        # Write to JSON file
        output_file = 'gita_ch02_combined.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(combined_data, f, ensure_ascii=False, indent=2)

        print(f"Successfully created {output_file}")
        print(f"Total verses: {len(combined_data)}")

        # Show a sample of the data
        if combined_data:
            print("\nSample verse:")
            sample = combined_data[0]
            for key, value in sample.items():
                if isinstance(value, str) and len(value) > 100:
                    print(f"  {key}: {value[:100]}...")
                else:
                    print(f"  {key}: {value}")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

    return 0

if __name__ == "__main__":
    exit(main())
