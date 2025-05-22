import { Verse, Chapter, getAllVerses, getChapterTitles } from '@/services/bhagavad-gita';

// Common themes in the Bhagavad Gita
export const GITA_THEMES = [
  'duty',
  'dharma',
  'karma',
  'devotion',
  'bhakti',
  'knowledge',
  'action',
  'meditation',
  'yoga',
  'renunciation',
  'self-realization',
  'divine',
  'nature',
  'gunas',
  'liberation',
  'moksha',
  'war',
  'peace',
  'wisdom',
  'detachment',
];

// Get all verses with their translations
export async function getAllVersesWithTranslations(): Promise<Verse[]> {
  return await getAllVerses();
}

// Get a specific verse by chapter and verse number
export async function getVerseByReference(chapter: number, verse: number): Promise<Verse | null> {
  const verses = await getAllVerses();
  return verses.find(v => v.chapter === chapter && v.verse === verse) || null;
}

// Get all verses from a specific chapter
export async function getVersesFromChapter(chapter: number): Promise<Verse[]> {
  const verses = await getAllVerses();
  return verses.filter(v => v.chapter === chapter);
}

// Get chapter information
export async function getChapterInfo(chapter: number): Promise<Chapter | null> {
  const chapters = await getChapterTitles();
  return chapters.find(c => c.chapter === chapter) || null;
}

// Get all chapters
export async function getAllChapters(): Promise<Chapter[]> {
  return await getChapterTitles();
}

// Search verses by keyword in translations
export async function searchVersesByKeyword(keyword: string, language: 'en' | 'jp' = 'en'): Promise<Verse[]> {
  const verses = await getAllVerses();
  const searchField = language === 'jp' ? 'translation_jp' : 'translation';
  
  return verses.filter(verse => 
    verse[searchField].toLowerCase().includes(keyword.toLowerCase())
  ).sort((a, b) => b.importance - a.importance);
}

// Search verses by theme (using predefined themes and keywords)
export async function searchVersesByTheme(theme: string, language: 'en' | 'jp' = 'en'): Promise<Verse[]> {
  // Map themes to related keywords
  const themeKeywords: Record<string, string[]> = {
    'duty': ['duty', 'responsibility', 'dharma', 'obligation'],
    'karma': ['karma', 'action', 'consequence', 'result', 'fruit'],
    'devotion': ['devotion', 'bhakti', 'worship', 'love', 'surrender'],
    'knowledge': ['knowledge', 'wisdom', 'understanding', 'jnana', 'truth'],
    'meditation': ['meditation', 'dhyana', 'concentration', 'focus', 'mind'],
    'yoga': ['yoga', 'discipline', 'practice', 'union', 'path'],
    'renunciation': ['renunciation', 'tyaga', 'detachment', 'abandon', 'give up'],
    'self-realization': ['self', 'atman', 'soul', 'realization', 'identity'],
    'divine': ['divine', 'god', 'supreme', 'lord', 'transcendent'],
    'nature': ['nature', 'prakriti', 'material', 'creation', 'manifest'],
    'gunas': ['guna', 'quality', 'mode', 'sattva', 'rajas', 'tamas'],
    'liberation': ['liberation', 'moksha', 'freedom', 'release', 'salvation'],
    'war': ['war', 'battle', 'fight', 'conflict', 'struggle'],
    'peace': ['peace', 'tranquility', 'calm', 'harmony', 'serenity'],
  };
  
  const keywords = themeKeywords[theme.toLowerCase()] || [theme];
  const verses = await getAllVerses();
  const searchField = language === 'jp' ? 'translation_jp' : 'translation';
  
  // Find verses that match any of the keywords
  const matchingVerses = verses.filter(verse => 
    keywords.some(keyword => 
      verse[searchField].toLowerCase().includes(keyword.toLowerCase())
    )
  );
  
  // Sort by importance
  return matchingVerses.sort((a, b) => b.importance - a.importance);
}

// Get a daily verse (weighted by importance)
export async function getDailyVerse(): Promise<Verse> {
  const verses = await getAllVerses();
  
  // Create a weighted array where higher importance verses appear more times
  const weightedVerses: Verse[] = [];
  
  verses.forEach(verse => {
    // Add the verse to the array 'importance' number of times
    for (let i = 0; i < verse.importance; i++) {
      weightedVerses.push(verse);
    }
  });
  
  // Select a random verse from the weighted array
  const randomIndex = Math.floor(Math.random() * weightedVerses.length);
  return weightedVerses[randomIndex];
}

// Generate a chapter summary
export async function generateChapterSummary(chapter: number, language: 'en' | 'jp' = 'en'): Promise<string> {
  const chapterInfo = await getChapterInfo(chapter);
  const verses = await getVersesFromChapter(chapter);
  
  if (!chapterInfo || verses.length === 0) {
    return language === 'jp' 
      ? '章の情報が見つかりませんでした。' 
      : 'Chapter information not found.';
  }
  
  // For now, we'll return a simple summary based on the chapter title
  // In a real implementation, this would use OpenAI to generate a proper summary
  const title = language === 'jp' ? chapterInfo.japaneseTitle : chapterInfo.title;
  
  return language === 'jp'
    ? `第${chapter}章: ${title} - ${verses.length}節からなるこの章は、バガヴァッド・ギーターの重要な教えを含んでいます。`
    : `Chapter ${chapter}: ${title} - This chapter contains ${verses.length} verses and covers important teachings of the Bhagavad Gita.`;
}
