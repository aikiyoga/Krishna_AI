import { NextRequest, NextResponse } from 'next/server';
import { generateKrishnaResponse } from '@/lib/openai';
import { searchVersesByKeyword, getVerseByReference } from '@/lib/verse-utils';
import { Verse } from '@/services/bhagavad-gita';
import { Message } from '@/components/ChatInterface';

export async function POST(req: NextRequest) {
  try {
    const { messages, language = 'en' }: { messages: Message[]; language?: 'en' | 'jp' } = await req.json();

    // Generate Krishna's response
    const response = await generateKrishnaResponse(messages, language);

    // Check if the response references specific verses
    const verseReferences = response ? extractVerseReferences(response) : [];
    let verses: Verse[] = [];

    if (verseReferences.length > 0) {
      // Fetch the referenced verses
      for (const ref of verseReferences) {
        const verse = await getVerseByReference(ref.chapter, ref.verse);
        if (verse) {
          verses.push(verse);
        }
      }
    } else {
      // If no specific verses were referenced, try to find relevant verses
      // based on keywords in the last user message
      const lastUserMessage = messages.findLast((m: Message) => m.role === 'user')?.content || '';
      const keywords = extractKeywords(lastUserMessage);
      
      if (keywords.length > 0) {
        // Get up to 3 relevant verses
        const relevantVerses = await Promise.all(
          keywords.slice(0, 3).map(keyword => searchVersesByKeyword(keyword, language as 'en' | 'jp'))
        );
        
        // Flatten and deduplicate verses
        verses = Array.from(
          new Map(
            relevantVerses.flat().map(verse => [`${verse.chapter}-${verse.verse}`, verse])
          ).values()
        ).slice(0, 3);
      }
    }

    return NextResponse.json({
      response,
      verses,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

// Helper function to extract verse references from text (e.g., "Bhagavad Gita 2.47" or "Chapter 2, Verse 47")
function extractVerseReferences(text: string): { chapter: number; verse: number }[] {
  const references: { chapter: number; verse: number }[] = [];
  let match;

  // Pattern for "Chapter X, Verse Y" or "Chapter X Verse Y"
  const chapterVersePattern = /Chapter\s+(\d+)[\s,]+Verse\s+(\d+)/gi;
  while ((match = chapterVersePattern.exec(text)) !== null) {
    references.push({
      chapter: parseInt(match[1], 10),
      verse: parseInt(match[2], 10),
    });
  }

  // Pattern for Japanese "第X章第Y節" or "第X章、第Y節"
  const jpChapterVersePattern = /第\s*(\d+)\s*章[、,\s]*第\s*(\d+)\s*節/g;
  while ((match = jpChapterVersePattern.exec(text)) !== null) {
    references.push({
      chapter: parseInt(match[1], 10),
      verse: parseInt(match[2], 10),
    });
  }

  // Pattern for Japanese short form "X章Y節"
  const jpShortPattern = /(\d+)\s*章\s*(\d+)\s*節/g;
  while ((match = jpShortPattern.exec(text)) !== null) {
    const chapter = parseInt(match[1], 10);
    if (chapter >= 1 && chapter <= 18) {
      references.push({ chapter, verse: parseInt(match[2], 10) });
    }
  }

  // Pattern for "X.Y" format (e.g., "2.47")
  const dotPattern = /\b(\d+)\.(\d+)\b/g;
  while ((match = dotPattern.exec(text)) !== null) {
    // Only add if it looks like a valid chapter/verse reference (chapters 1-18)
    const chapter = parseInt(match[1], 10);
    if (chapter >= 1 && chapter <= 18) {
      references.push({
        chapter,
        verse: parseInt(match[2], 10),
      });
    }
  }

  // Deduplicate
  return Array.from(
    new Map(references.map(r => [`${r.chapter}-${r.verse}`, r])).values()
  );
}

// Helper function to detect if text is primarily Japanese
function isJapanese(text: string): boolean {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text);
}

// Helper function to extract potential keywords from user message
function extractKeywords(text: string): string[] {
  if (isJapanese(text)) {
    return extractJapaneseKeywords(text);
  }

  // Remove common words and punctuation
  const cleanedText = text.toLowerCase()
    .replace(/[.,?!;:'"()\[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into words
  const words = cleanedText.split(' ');

  // Filter out common words (simple stopwords)
  const stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'to', 'of', 'in', 'on',
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'from', 'up', 'down', 'i', 'me', 'my', 'myself',
    'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
    'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom',
    'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and',
    'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should',
    'now', 'tell', 'know', 'like', 'go', 'make', 'say', 'see', 'time', 'look'];

  const keywords = words.filter(word =>
    word.length > 3 && !stopwords.includes(word)
  );

  // Return unique keywords
  return Array.from(new Set(keywords));
}

// Extract keywords from Japanese text by matching against Gita-related terms
function extractJapaneseKeywords(text: string): string[] {
  const jpKeywords = [
    '義務', 'ダルマ', 'カルマ', '献身', 'バクティ', '知識', '行動',
    '瞑想', 'ヨーガ', '放棄', '自己実現', '神聖', '自然', 'グナ',
    '解放', 'モクシャ', '戦争', '平和', '智慧', '無執着',
    'アートマン', '魂', '真我', '神', '至上', '主',
    '行為', '業', '信愛', '崇拝', '愛', '苦しみ', '喜び',
    '恐れ', '怒り', '欲望', '心', '精神', '死', '生',
    '輪廻', '悟り', '修行', '祈り', '真理', '義', '責任',
    'サットヴァ', 'ラジャス', 'タマス', 'プラクリティ', 'ジュニャーナ',
  ];

  const found = jpKeywords.filter(keyword => text.includes(keyword));
  return found.length > 0 ? found : [];
}
