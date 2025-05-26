'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import VerseDisplay from '@/components/VerseDisplay';
import { Verse, Chapter } from '@/services/bhagavad-gita';
import { useLanguage } from "@/components/ClientLayout";

export default function ChapterDetailPage() {
  const params = useParams();
  const chapterId = typeof params.id === 'string' ? parseInt(params.id, 10) : 1;
  const { language } = useLanguage();
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch chapter info
        const { getChapterInfo, getVersesFromChapter } = await import('@/services/bhagavad-gita');
        const chapterInfo = await getChapterInfo(chapterId);
        const chapterVerses = await getVersesFromChapter(chapterId);
        
        if (!chapterInfo) {
          throw new Error('Chapter not found');
        }
        
        setChapter(chapterInfo);
        setVerses(chapterVerses);
        
        // Fetch chapter summary
        const summaryResponse = await fetch(`/api/chapter-summary?chapter=${chapterId}&language=${language}`);
        
        if (!summaryResponse.ok) {
          throw new Error('Failed to fetch chapter summary');
        }
        
        const summaryData = await summaryResponse.json();
        setSummary(summaryData.summary);
      } catch (err) {
        console.error('Error fetching chapter data:', err);
        setError(language === 'jp' 
          ? '章のデータを取得できませんでした。' 
          : 'Could not retrieve chapter data.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChapterData();
  }, [chapterId, language]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500">{error || (language === 'jp' ? '章が見つかりませんでした。' : 'Chapter not found.')}</p>
        <Link 
          href="/chapters"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {language === 'jp' ? '章一覧に戻る' : 'Back to Chapters'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/chapters"
          className="text-blue-500 hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === 'jp' ? '章一覧に戻る' : 'Back to Chapters'}
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">
        {language === 'jp' 
          ? `第${chapter.chapter}章: ${chapter.japaneseTitle}` 
          : `Chapter ${chapter.chapter}: ${chapter.title}`}
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {language === 'jp' ? '章の要約' : 'Chapter Summary'}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{summary}</p>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">
        {language === 'jp' ? '節' : 'Verses'}
      </h2>
      
      <div className="space-y-6">
        {verses.map((verse) => (
          <VerseDisplay 
            key={`${verse.chapter}-${verse.verse}`} 
            verse={verse} 
            language={language} 
          />
        ))}
      </div>
    </div>
  );
}
