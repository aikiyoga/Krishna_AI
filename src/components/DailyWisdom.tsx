'use client';

import { useState, useEffect } from 'react';
import { Verse } from '@/services/bhagavad-gita';
import { getRandomVerse, getInsightsForVerse } from '@/services/bhagavad-gita';
import VerseDisplay from './VerseDisplay';

interface DailyWisdomProps {
  language: 'en' | 'jp';
}

export default function DailyWisdom({ language }: DailyWisdomProps) {
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const [reflection, setReflection] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyTooltip = language === 'jp' ? 'クリップボードにコピー' : 'Copy to clipboard';
  const copySuccessTooltip = language === 'jp' ? 'コピー成功！' : 'Copied!';

  const handleCopyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to parent
    try {
      const headerText = language === 'jp' ? 'クリシュナの洞察：' : 'Krishna\'s Insight:';
      const textToCopy = headerText + '\n' + reflection;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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

          // Fetch verse reflection from the source
          const verseInsights = await getInsightsForVerse(d_chapter, d_verse);
          if (verseInsights) {
            setDailyVerse(daily_verse);
            setReflection(language === 'jp' ? verseInsights.insights_jp : verseInsights.insights);
            sessionStorage.setItem(`verse_insights_${d_chapter}_${d_verse}_${language}`, 
              language === 'jp' ? verseInsights.insights_jp : verseInsights.insights);
            setIsLoading(false);
            return; // Do not fetch from server
          }

          // Fetch verse reflection from the current session
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

        // Fetch verse reflection from the source
        const verseInsights = await getInsightsForVerse(daily_verse.chapter, daily_verse.verse);
        if (verseInsights) {
          sessionStorage.setItem("daily_verse", JSON.stringify(daily_verse));
          setDailyVerse(daily_verse);
          setReflection(language === 'jp' ? verseInsights.insights_jp : verseInsights.insights);
          sessionStorage.setItem(`verse_insights_${daily_verse.chapter}_${daily_verse.verse}_${language}`, 
            language === 'jp' ? verseInsights.insights_jp : verseInsights.insights);
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
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg italic relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium">
                {language === 'jp' ? 'クリシュナの洞察' : 'Krishna\'s Insight'}
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
