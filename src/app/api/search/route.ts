import { NextRequest, NextResponse } from 'next/server';
import { searchVersesByKeyword, searchVersesByTheme, GITA_THEMES, GITA_THEMES_JP } from '@/lib/verse-utils';
import { Verse } from '@/services/bhagavad-gita';

export async function GET(req: NextRequest) {
  try {
    // Get search parameters
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const theme = searchParams.get('theme');
    const language = searchParams.get('language') === 'jp' ? 'jp' : 'en';
    
    if (!query && !theme) {
      return NextResponse.json(
        { error: 'Query or theme parameter is required' },
        { status: 400 }
      );
    }
    
    let verses: Verse[] = [];
    
    if (theme) {
      // Search by theme
      verses = await searchVersesByTheme(theme, language);
    } else if (query) {
      // Search by keyword
      verses = await searchVersesByKeyword(query, language);
    }
    
    // Return search results
    return NextResponse.json({
      query: query || theme,
      type: theme ? 'theme' : 'keyword',
      results: verses,
      count: verses.length,
      availableThemes: language === 'jp' ? GITA_THEMES_JP : GITA_THEMES,
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Failed to search verses' },
      { status: 500 }
    );
  }
}
