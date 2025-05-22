import { NextRequest, NextResponse } from 'next/server';
import { getDailyVerse } from '@/lib/verse-utils';
import { openai, mymodel, deepmodel } from '@/lib/openai';

export async function GET(req: NextRequest) {
  try {
    // Get language preference from query parameter
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language') === 'jp' ? 'jp' : 'en';
    
    // Get a daily verse (weighted by importance)
    const verse = await getDailyVerse();
    
    // Generate a reflection on the verse using OpenAI
    const reflection = await generateReflection(verse, language);
    
    return NextResponse.json({
      verse,
      reflection,
    });
  } catch (error) {
    console.error('Error in daily verse API:', error);
    return NextResponse.json(
      { error: 'Failed to get daily verse' },
      { status: 500 }
    );
  }
}

// Generate a reflection on the verse using OpenAI
async function generateReflection(verse: any, language: 'en' | 'jp'): Promise<string> {
  try {
    const translation = language === 'jp' ? verse.translation_jp : verse.translation;
    
    const prompt = language === 'jp'
      ? `以下のバガヴァッド・ギーターの節について、クリシュナの視点から短い洞察を提供してください（100-150文字）：\n\n${translation}`
      : `Provide a brief insight (100-150 words) from Krishna's perspective on this Bhagavad Gita verse:\n\n${translation}`;
    
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
      max_tokens: 200,
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating reflection:', error);
    return language === 'jp'
      ? 'この節についての洞察を生成できませんでした。'
      : 'Could not generate an insight for this verse.';
  }
}
