'use client';

import { useState, useEffect } from 'react';
import { Verse } from '@/services/bhagavad-gita';
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

  useEffect(() => {
    const fetchVerseInsights = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        //console.log("fetching verse: ", language, chapter, verse, isLoading);
        // temporarily disable api call
        //if (false) {
        
        const response = await fetch(`/api/daily-verse?language=${language}&chapter=${chapter}&verse=${verse}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch selected verse');
        }
        
        const data = await response.json();
        setReflection(data.reflection);
        //}
        
        //setReflection('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.');
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
  }, [language]);

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
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg italic">
            <h3 className="text-sm font-medium mb-2">
              {language === 'jp' ? 'この詩に対するクリシュナの洞察' : 'Krishna\'s Insight on this Verse'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{reflection}</p>
          </div>
        </>
      )}
    </div>
  );
}
