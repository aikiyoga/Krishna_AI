# Bhagavad Gita Data Extraction Scripts

This directory contains Python scripts to extract and combine data from the Bhagavad Gita TypeScript files into JSON format for use in the Krishna AI project.

## Files Overview

### Main Scripts
- **`extract_gita_simple.py`** - Universal extractor for any chapter (4-18)
- **`extract_all_chapters.py`** - Batch extractor for all chapters (4-18)
- **`chapter_summary.py`** - Generate statistics and master index

### Legacy Scripts (for reference)
- **`extract_gita_simple_ch02.py`** - Chapter 2 specific extractor
- **`extract_gita_simple_ch03.py`** - Chapter 3 specific extractor

## Usage

### Extract a Single Chapter

```bash
# Extract Chapter 4
python3 extract_gita_simple.py 4

# Extract Chapter 18 with custom output filename
python3 extract_gita_simple.py 18 --output chapter18_data.json

# Show help
python3 extract_gita_simple.py --help
```

### Extract All Chapters (4-18)

```bash
# Extract all chapters at once
python3 extract_all_chapters.py
```

### Generate Summary and Statistics

```bash
# Create summary and master index
python3 chapter_summary.py
```

## Output Files

### Individual Chapter Files
Each chapter extraction creates a JSON file with the format: `gita_chXX_combined.json`

Example: `gita_ch04_combined.json`, `gita_ch18_combined.json`

### Master Index File
The summary script creates: `bhagavad_gita_master_index.json`

## Data Structure

Each JSON file contains an array of verse objects with the following structure:

```json
{
  "chapter": 4,
  "verse": 1,
  "text": "Sanskrit text of the verse",
  "importance": 8,
  "translation": "English translation",
  "translation_jp": "Japanese translation",
  "insights": "English insights from Krishna's perspective",
  "insights_jp": "Japanese insights from Krishna's perspective"
}
```

## Statistics Summary

Based on the complete extraction:

- **Total Chapters**: 17 (Chapters 2-18)
- **Total Verses**: 653
- **Total File Size**: ~1.41 MB
- **Average Verses per Chapter**: 38.4

### Chapter Breakdown

| Chapter | Verses | File Size | Description |
|---------|--------|-----------|-------------|
| 2       | 72     | 163.7 KB  | Sankhya Yoga |
| 3       | 43     | 96.7 KB   | Karma Yoga |
| 4       | 42     | 95.6 KB   | Jnana Yoga |
| 5       | 29     | 64.3 KB   | Karma Vairagya Yoga |
| 6       | 47     | 103.8 KB  | Abhyasa Yoga |
| 7       | 30     | 63.9 KB   | Paramahamsa Vijnana Yoga |
| 8       | 28     | 58.5 KB   | Akshara Brahma Yoga |
| 9       | 34     | 75.3 KB   | Raja Vidya Yoga |
| 10      | 42     | 91.2 KB   | Vibhuti Vistara Yoga |
| 11      | 55     | 126.9 KB  | Visvarupa Darsana Yoga |
| 12      | 20     | 44.8 KB   | Bhakti Yoga |
| 13      | 34     | 74.9 KB   | Ksetra Ksetrajna Vibhaga Yoga |
| 14      | 27     | 59.6 KB   | Gunatraya Vibhaga Yoga |
| 15      | 20     | 45.7 KB   | Purusottama Yoga |
| 16      | 24     | 52.7 KB   | Daivasura Sampad Vibhaga Yoga |
| 17      | 28     | 60.3 KB   | Sraddhatraya Vibhaga Yoga |
| 18      | 78     | 170.1 KB  | Moksha Opadesa Yoga |

## Features

### Robust Parsing
- Handles different TypeScript formatting styles
- Supports both quoted and unquoted field names
- Manages multiline strings correctly
- Preserves UTF-8 encoding for Sanskrit and Japanese text

### Error Handling
- Validates chapter numbers (4-18)
- Provides clear error messages
- Continues processing even if some entries have issues
- Reports missing or problematic data

### Flexible Output
- Custom output filenames
- Batch processing capabilities
- Comprehensive statistics and summaries
- Master index for easy navigation

## Requirements

- Python 3.6+
- Standard library modules only (no external dependencies)

## Source Files

The scripts extract data from these TypeScript files in `src/services/`:
- `gita_chXX.ts` - Contains verse data (Sanskrit text, translations, importance)
- `gita_chXX_insights.ts` - Contains insights from Krishna's perspective

## Integration with Krishna AI

These JSON files are ready for integration into the Krishna AI project and provide:
- Complete verse text in Sanskrit
- English and Japanese translations
- Importance ratings for each verse
- Contextual insights from Krishna's perspective in both languages
- Structured data format for easy programmatic access

## Troubleshooting

### Common Issues

1. **File not found errors**: Ensure the TypeScript source files exist in `src/services/`
2. **Encoding issues**: All files use UTF-8 encoding to handle Sanskrit and Japanese characters
3. **Parsing errors**: The scripts handle most formatting variations, but very unusual formatting might require manual adjustment

### Getting Help

Run any script with `--help` to see usage information:
```bash
python3 extract_gita_simple.py --help
```

## Future Enhancements

Potential improvements for future versions:
- Support for Chapter 1 (if needed)
- Export to other formats (CSV, XML, etc.)
- Validation against original Sanskrit sources
- Integration with verse lookup APIs
- Automated testing for data integrity
