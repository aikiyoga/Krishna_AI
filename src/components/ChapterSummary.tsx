'use client';

import { useState, useEffect } from 'react';
import { getChapterSummary } from '@/services/bhagavad-gita';

interface ChapterSummaryProps {
  language: 'en' | 'jp';
  chapterId: number;
}

export default function ChapterSummary({ language, chapterId }: ChapterSummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterSummary = async () => {
      //console.log(`Fetching chapter summary for chapter ${chapterId} in ${language}`);
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch chapter summary from the source
        const chapterSummary = await getChapterSummary(chapterId);
        if (chapterSummary) {
          setSummary(language === 'jp' ? chapterSummary.summary_jp : chapterSummary.summary);
          setIsLoading(false);
          return;
        }

        // Fetch chapter summary from the current session
        const summary_in_session = sessionStorage.getItem(`chapter_summary_${chapterId}_${language}`);
        if (summary_in_session) {
          setSummary(summary_in_session);
          setIsLoading(false);
          return;
        }
        
        // Fetch chapter summary from API
        const summaryResponse = await fetch(`/api/chapter-summary?chapter=${chapterId}&language=${language}`);
        
        if (!summaryResponse.ok) {
          throw new Error('Failed to fetch chapter summary');
        }

        // Cache the summary in the current session
        const summaryData = await summaryResponse.json();
        sessionStorage.setItem(`chapter_summary_${chapterId}_${language}`, summaryData.summary);
        
        setSummary(summaryData.summary);
      } catch (err) {
        console.error('Error fetching chapter summary:', err);
        setError(language === 'jp' 
          ? '章の要約を取得できませんでした。' 
          : 'Could not retrieve chapter summary.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChapterSummary();
  }, [chapterId, language]);

  if (isLoading) {
    return (
        <div className="w-full md:w-2/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {language === 'jp' ? '章の要約' : 'Chapter Summary'}
            </h2>
            <div className='animate-pulse'>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full md:w-2/3">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {language === 'jp' ? '章の要約' : 'Chapter Summary'}
            </h2>
            <div className="max-w-4xl mx-auto p-6">
                <p className="text-red-500">{error}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="w-full md:w-2/3">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {language === 'jp' ? '章の要約' : 'Chapter Summary'}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{summary}</p>
    </div>
  );
}
