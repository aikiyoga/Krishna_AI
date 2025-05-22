'use client';

import { useState } from 'react';
import { Verse } from '@/services/bhagavad-gita';

interface VerseDisplayProps {
  verse: Verse;
  language: 'en' | 'jp';
  compact?: boolean;
}

export default function VerseDisplay({ verse, language, compact = false }: VerseDisplayProps) {
  const [showSanskrit, setShowSanskrit] = useState(false);
  const [showBothLanguages, setShowBothLanguages] = useState(false);
  
  const translation = language === 'jp' ? verse.translation_jp : verse.translation;
  const otherTranslation = language === 'jp' ? verse.translation : verse.translation_jp;
  
  return (
    <div className={`rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${compact ? 'text-sm' : ''}`}>
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
        <h3 className="font-medium">
          {language === 'jp' 
            ? `第${verse.chapter}章 第${verse.verse}節` 
            : `Chapter ${verse.chapter}, Verse ${verse.verse}`}
        </h3>
        
        {!compact && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSanskrit(!showSanskrit)}
              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {showSanskrit 
                ? (language === 'jp' ? 'サンスクリット語を隠す' : 'Hide Sanskrit') 
                : (language === 'jp' ? 'サンスクリット語を表示' : 'Show Sanskrit')}
            </button>
            
            <button
              onClick={() => setShowBothLanguages(!showBothLanguages)}
              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {showBothLanguages 
                ? (language === 'jp' ? '翻訳を一つだけ表示' : 'Show One Translation') 
                : (language === 'jp' ? '両方の翻訳を表示' : 'Show Both Translations')}
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-2 bg-white dark:bg-gray-800">
        {showSanskrit && !compact && (
          <div className="italic text-gray-600 dark:text-gray-400">
            {verse.text}
          </div>
        )}
        
        <div>
          {translation}
        </div>
        
        {showBothLanguages && !compact && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            {otherTranslation}
          </div>
        )}
        
        {!compact && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-1" 
              style={{ 
                backgroundColor: `rgba(${Math.min(255, verse.importance * 25)}, ${Math.min(255, (10 - verse.importance) * 25)}, 0)` 
              }}
            ></span>
            {language === 'jp' 
              ? `重要度: ${verse.importance}/10` 
              : `Importance: ${verse.importance}/10`}
          </div>
        )}
      </div>
    </div>
  );
}
