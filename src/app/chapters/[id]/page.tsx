'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import VerseDisplay from '@/components/VerseDisplay';
import { Verse, Chapter } from '@/services/bhagavad-gita';
import { useLanguage } from "@/components/ClientLayout";
import Image from 'next/image';
import ChapterSummary from '@/components/ChapterSummary';

export default function ChapterDetailPage() {
  const params = useParams();
  const chapterId = typeof params.id === 'string' ? parseInt(params.id, 10) : 1;
  const { language } = useLanguage();
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch chapter info with better error handling
        const { getChapterInfo, getVersesFromChapter } = await import('@/services/bhagavad-gita');
        const chapterInfo = await getChapterInfo(chapterId);
        const chapterVerses = await getVersesFromChapter(chapterId);
        
        if (!chapterInfo) {
          throw new Error('Chapter not found');
        }
        
        setChapter(chapterInfo);
        setVerses(chapterVerses);
        
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
          className="mt-4 inline-block px-4 py-2 bg-[#008080E6] text-white rounded-md hover:bg-[#00a2a2]"
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
          className="text-[#008080E6] hover:underline flex items-center"
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
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative w-full md:w-1/3 h-[300px] md:h-[400px] rounded-2xl shadow-lg flex items-center justify-center">
            <Image
              src={`/chapters/Chapter${chapter.chapter}.jpeg`}
              alt="Gita Chapter"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
          
          <ChapterSummary language={language} chapterId={chapterId} />
        

        </div>
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
            insights={true}
          />
        ))}
      </div>
    </div>
  );
}
