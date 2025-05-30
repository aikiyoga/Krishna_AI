'use client';

import { useLanguage } from "@/components/ClientLayout";
import VerseSearch from '@/components/VerseSearch';
import Image from 'next/image';

export default function SearchPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-row items-center justify-center mb-2 -ml-24">
        <Image
          src="/gita_search.png"
          alt="Bhagavad Gita"
          width={80}
          height={80}
          className="mr-2 -mt-4"
        />
        <h1 className={`text-3xl font-bold mb-4 ${language === 'jp' ? 'krishna-self_jp' : 'krishna-self'}`}>
         {language === 'jp' ? 'バガヴァッド・ギーターを検索' : 'Search the Bhagavad Gita'}
        </h1>
      </div>
      
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
