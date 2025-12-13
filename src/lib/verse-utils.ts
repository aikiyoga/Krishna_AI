import { Verse, Chapter, getAllVerses, getChapterTitles, getRandomVerse } from '@/services/bhagavad-gita';

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

// Japanese translations of Bhagavad Gita themes
export const GITA_THEMES_JP = [
  '義務',        // duty
  'ダルマ',      // dharma
  'カルマ',      // karma
  '献身',        // devotion
  'バクティ',    // bhakti
  '知識',        // knowledge
  '行動',        // action
  '瞑想',        // meditation
  'ヨーガ',      // yoga
  '放棄',        // renunciation
  '自己実現',    // self-realization
  '神聖',        // divine
  '自然',        // nature
  'グナ',        // gunas
  '解放',        // liberation
  'モクシャ',    // moksha
  '戦争',        // war
  '平和',        // peace
  '智慧',        // wisdom
  '無執着',      // detachment
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
  // Map themes to related keywords (English)
  const themeKeywords: Record<string, string[]> = {
    'duty': ['duty', 'responsibility', 'dharma', 'obligation'],
    'dharma': ['dharma', 'duty', 'responsibility', 'righteousness', 'obligation'],
    'karma': ['karma', 'action', 'consequence', 'result', 'fruit'],
    'devotion': ['devotion', 'bhakti', 'worship', 'love', 'surrender'],
    'bhakti': ['bhakti', 'devotion', 'worship', 'love', 'surrender'],
    'knowledge': ['knowledge', 'wisdom', 'understanding', 'jnana', 'truth'],
    'action': ['action', 'karma', 'work', 'activity', 'doing'],
    'meditation': ['meditation', 'dhyana', 'concentration', 'focus', 'mind'],
    'yoga': ['yoga', 'discipline', 'practice', 'union', 'path'],
    'renunciation': ['renunciation', 'tyaga', 'detachment', 'abandon', 'give up'],
    'self-realization': ['self', 'atman', 'soul', 'realization', 'identity'],
    'divine': ['divine', 'god', 'supreme', 'lord', 'transcendent'],
    'nature': ['nature', 'prakriti', 'material', 'creation', 'manifest'],
    'gunas': ['guna', 'quality', 'mode', 'sattva', 'rajas', 'tamas'],
    'liberation': ['liberation', 'moksha', 'freedom', 'release', 'salvation'],
    'moksha': ['moksha', 'liberation', 'freedom', 'release', 'salvation'],
    'war': ['war', 'battle', 'fight', 'conflict', 'struggle'],
    'peace': ['peace', 'tranquility', 'calm', 'harmony', 'serenity'],
    'wisdom': ['wisdom', 'knowledge', 'understanding', 'jnana', 'truth'],
    'detachment': ['detachment', 'tyaga', 'renunciation', 'abandon', 'give up'],
  };

  // Map themes to related keywords (Japanese)
  const themeKeywordsJP: Record<string, string[]> = {
    'duty': ['義務', 'ダルマ', '責任', '務め'],
    'dharma': ['ダルマ', '義務', '法', '正義'],
    'karma': ['カルマ', '行為', '行動', '業'],
    'devotion': ['献身', 'バクティ', '信愛', '崇拝', '愛'],
    'bhakti': ['バクティ', '献身', '信愛', '崇拝'],
    'knowledge': ['知識', '智慧', '理解', 'ジュニャーナ'],
    'action': ['行動', '行為', 'カルマ', '働き'],
    'meditation': ['瞑想', 'ディヤーナ', '集中'],
    'yoga': ['ヨーガ', '修練', '結合'],
    'renunciation': ['放棄', 'ティヤーガ', '捨離'],
    'self-realization': ['自己実現', 'アートマン', '魂', '真我'],
    'divine': ['神聖', '神', '至上', '主'],
    'nature': ['自然', 'プラクリティ', '物質'],
    'gunas': ['グナ', '性質', '属性', 'サットヴァ', 'ラジャス', 'タマス'],
    'liberation': ['解放', 'モクシャ', '自由', '救済'],
    'moksha': ['モクシャ', '解放', '自由'],
    'war': ['戦争', '戦い', '闘争'],
    'peace': ['平和', '平安', '静けさ', '調和'],
    'wisdom': ['智慧', '知識', '理解'],
    'detachment': ['無執着', '放棄', '離欲'],
  };

  const keywords = language === 'jp'
    ? (themeKeywordsJP[theme.toLowerCase()] || [theme])
    : (themeKeywords[theme.toLowerCase()] || [theme]);

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

/*const weightedVerses: Verse[] = [];
async function createWeightedVerses() {
  if (weightedVerses.length > 0) return;
  
  const verses = await getAllVerses();

  verses.forEach((verse, index) => {
    // Add the verse to the array 'importance' number of times
    for (let i = 0; i < verse.importance; i++) {
      weightedVerses.push(verse);
    }
  });
}*/

// Get a daily verse (weighted by importance)
export async function getDailyVerse(): Promise<Verse> {
  return await getRandomVerse();
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
