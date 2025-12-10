import { NextRequest, NextResponse } from 'next/server';
import { getChapterInfo, getVersesFromChapter } from '@/lib/verse-utils';
import { openai, mymodel, deepmodel } from '@/lib/openai';
import { rateLimit, getIdentifier } from '@/lib/rate-limit';

// Rate limiter: 20 requests per minute per IP (less intensive than chat)
const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 20,
});

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const identifier = getIdentifier(req);
  const rateLimitResult = await limiter.check(identifier);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {
    // Get chapter number and language from query parameters
    const { searchParams } = new URL(req.url);
    const chapterParam = searchParams.get('chapter');
    const language = searchParams.get('language') === 'jp' ? 'jp' : 'en';
    
    if (!chapterParam) {
      return NextResponse.json(
        { error: 'Chapter parameter is required' },
        { status: 400 }
      );
    }
    
    const chapter = parseInt(chapterParam, 10);
    
    // Validate chapter number
    if (isNaN(chapter) || chapter < 1 || chapter > 18) {
      return NextResponse.json(
        { error: 'Invalid chapter number. Must be between 1 and 18.' },
        { status: 400 }
      );
    }
    
    // Get chapter info and verses
    const chapterInfo = await getChapterInfo(chapter);
    const verses = await getVersesFromChapter(chapter);
    
    if (!chapterInfo) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }
    
    // Generate summary using OpenAI if it doesn't exist in the current session
    const summary = await generateChapterSummary(chapter, chapterInfo, verses, language);
    
    return NextResponse.json({
      chapter: chapterInfo,
      summary,
      verseCount: verses.length,
    });
  } catch (error) {
    console.error('Error in chapter summary API:', error);
    return NextResponse.json(
      { error: 'Failed to generate chapter summary' },
      { status: 500 }
    );
  }
}

// Generate a chapter summary using OpenAI
async function generateChapterSummary(
  chapterNum: number, 
  chapterInfo: any, 
  verses: any[], 
  language: 'en' | 'jp'
): Promise<string> {
  try {
    // Select a subset of important verses to include in the prompt
    const importantVerses = verses
      .filter(verse => verse.importance >= 8)
      .slice(0, 5)
      .map(verse => language === 'jp' ? verse.translation_jp : verse.translation)
      .join('\n\n');
    
    const title = language === 'jp' ? chapterInfo.japaneseTitle : chapterInfo.title;
    
    const prompt = language === 'jp'
      ? `バガヴァッド・ギーター第${chapterNum}章「${title}」の要約を、クリシュナの視点から200-250文字で作成してください。以下は章の重要な節です：\n\n${importantVerses}`
      : `Create a summary (200-250 words) of Chapter ${chapterNum} of the Bhagavad Gita: "${title}" from Krishna's perspective. Here are some important verses from the chapter:\n\n${importantVerses}`;
    
    const response = await openai.chat.completions.create({
      model: deepmodel,
      messages: [
        {
          role: 'system',
          content: 'You are Lord Krishna from the Bhagavad Gita. Speak in first person as Krishna would, with wisdom, compassion, and authority.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating chapter summary:', error);
    return language === 'jp'
      ? `第${chapterNum}章「${chapterInfo.japaneseTitle}」の要約を生成できませんでした。`
      : `Could not generate a summary for Chapter ${chapterNum}: ${chapterInfo.title}.`;
  }
}
