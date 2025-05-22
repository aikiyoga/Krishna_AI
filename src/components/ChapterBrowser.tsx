'use client';

import { useState, useEffect } from 'react';
import { Chapter } from '@/services/bhagavad-gita';
import Link from 'next/link';

interface ChapterBrowserProps {
  language: 'en' | 'jp';
}

export default function ChapterBrowser({ language }: ChapterBrowserProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll import directly from the service
        const { getChapterTitles } = await import('@/services/bhagavad-gita');
        const chapterData = await getChapterTitles();
        setChapters(chapterData);
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError(language === 'jp' 
          ? '章の情報を取得できませんでした。' 
          : 'Could not retrieve chapter information.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChapters();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chapters.map((chapter) => (
        <Link 
          key={chapter.chapter} 
          href={`/chapters/${chapter.chapter}`}
          className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{chapter.chapter}</span>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
              {language === 'jp' ? 'ヨーガ' : 'Yoga'}
            </span>
          </div>
          <h3 className="mt-2 font-medium">
            {language === 'jp' ? chapter.japaneseTitle : chapter.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {language === 'jp' 
              ? `第${chapter.chapter}章` 
              : `Chapter ${chapter.chapter}`}
          </p>
        </Link>
      ))}
    </div>
  );
}
