'use client';

import { useLanguage } from "@/components/ClientLayout";
import VerseSearch from '@/components/VerseSearch';

export default function SearchPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {language === 'jp' ? 'バガヴァッド・ギーターを検索' : 'Search the Bhagavad Gita'}
      </h1>
      
      <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
        {language === 'jp' 
          ? 'キーワードやテーマでバガヴァッド・ギーターの節を検索してください。' 
          : 'Search the verses of the Bhagavad Gita by keywords or themes.'}
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <VerseSearch language={language} />
      </div>
    </div>
  );
}
