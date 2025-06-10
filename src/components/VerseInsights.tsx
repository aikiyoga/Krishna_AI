'use client';

import { useState, useEffect } from 'react';
import { getInsightsForVerse } from '@/services/bhagavad-gita';
import VerseDisplay from './VerseDisplay';

interface VerseInsightsProps {
  language: 'en' | 'jp';
  chapter: number;
  verse: number;
}

export default function VerseInsights({ language, chapter, verse }: VerseInsightsProps) {
  const [reflection, setReflection] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyTooltip = language === 'jp' ? 'クリップボードにコピー' : 'Copy to clipboard';
  const copySuccessTooltip = language === 'jp' ? 'コピー成功！' : 'Copied!';

  const headerText = language === 'jp' ? `${chapter}章${verse}節に対するクリシュナの洞察：` : `Krishna\'s Insight on the Verse ${chapter}:${verse}:`;

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent
    try {
      const textToCopy = headerText + '\n' + reflection;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    const fetchVerseInsights = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch verse reflection from the source
        const verseInsights = await getInsightsForVerse(chapter, verse);
        if (verseInsights) {
          setReflection(language === 'jp' ? verseInsights.insights_jp : verseInsights.insights);
          setIsLoading(false);
          return;
        }

        // Fetch verse reflection from the current session
        const response_in_session = sessionStorage.getItem(`verse_insights_${chapter}_${verse}_${language}`);
        if (response_in_session) {
          setReflection(response_in_session);
          setIsLoading(false);
          return;
        }
        
        // Fetch verse reflection from API
        const response = await fetch(`/api/daily-verse?language=${language}&chapter=${chapter}&verse=${verse}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch selected verse');
        }
        
        const data = await response.json();
        setReflection(data.reflection);

        // Cache the reflection in the current session
        sessionStorage.setItem(`verse_insights_${chapter}_${verse}_${language}`, data.reflection);
        
      } catch (err) {
        console.error('Error fetching selected verse:', err);
        setError(language === 'jp' 
          ? 'この節のクリシュナの洞察を取得できませんでした。後でもう一度お試しください。' 
          : 'Could not retrieve Krishna\'s insight for this verse. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVerseInsights();
  }, [language, chapter, verse]);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
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
    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {(
        <>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg italic relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium">
                {language === 'jp' ? 'この詩に対するクリシュナの洞察' : 'Krishna\'s Insight on this Verse'}
              </h3>
              <button
                onClick={handleCopyToClipboard}
                className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                title={copyTooltip}
              >
                {copySuccess ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label={copySuccessTooltip}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label={copyTooltip}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{reflection}</p>
          </div>
        </>
      )}
    </div>
  );
}
