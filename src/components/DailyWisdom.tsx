'use client';

import { useState, useEffect } from 'react';
import { Verse } from '@/services/bhagavad-gita';
import { getRandomVerse } from '@/services/bhagavad-gita';
import VerseDisplay from './VerseDisplay';

interface DailyWisdomProps {
  language: 'en' | 'jp';
}

export default function DailyWisdom({ language }: DailyWisdomProps) {
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const [reflection, setReflection] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let daily_verse = null;
        let response_in_session = null;
        const dailyverse_in_session = sessionStorage.getItem("daily_verse");
        if (dailyverse_in_session) {
          daily_verse = JSON.parse(dailyverse_in_session);
          const d_chapter = daily_verse.chapter;
          const d_verse = daily_verse.verse;
          response_in_session = sessionStorage.getItem(`verse_insights_${d_chapter}_${d_verse}_${language}`);
        }

        if (dailyverse_in_session && response_in_session) {
          setDailyVerse(daily_verse);
          setReflection(response_in_session);
          setIsLoading(false);
          return; // Do not fetch from server
        }

        // Choose random verse and attempt to load from the current session
        daily_verse = await getRandomVerse();
        response_in_session = sessionStorage.getItem(`verse_insights_${daily_verse.chapter}_${daily_verse.verse}_${language}`);
        if (response_in_session) {
          sessionStorage.setItem("daily_verse", JSON.stringify(daily_verse));
          setDailyVerse(daily_verse);
          setReflection(response_in_session);
          setIsLoading(false);
          return; // Do not fetch from server
        }

        // Fetch verse reflection from API if it does not exist in the current session.
        // mostlikely, daily_verse should be not_null here though.
        const response = daily_verse ?
          await fetch(`/api/daily-verse?language=${language}&chapter=${daily_verse.chapter}&verse=${daily_verse.verse}`) :
          await fetch(`/api/daily-verse?language=${language}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch daily verse');
        }
        
        const data = await response.json();
        setDailyVerse(data.verse);
        setReflection(data.reflection);

        // Cache the reflection in the current session
        sessionStorage.setItem("daily_verse", JSON.stringify(data.verse));
        const chapter = data.verse.chapter;
        const verse = data.verse.verse;
        sessionStorage.setItem(`verse_insights_${chapter}_${verse}_${language}`, data.reflection);

      } catch (err) {
        console.error('Error fetching daily verse:', err);
        setError(language === 'jp' 
          ? '今日の知恵を取得できませんでした。後でもう一度お試しください。' 
          : 'Could not retrieve today\'s wisdom. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDailyVerse();
  }, [language]);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
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
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      
      {dailyVerse && (
        <>
          <VerseDisplay verse={dailyVerse} language={language} />
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg italic">
            <h3 className="text-sm font-medium mb-2">
              {language === 'jp' ? 'クリシュナの洞察' : 'Krishna\'s Insight'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{reflection}</p>
          </div>
        </>
      )}
    </div>
  );
}
