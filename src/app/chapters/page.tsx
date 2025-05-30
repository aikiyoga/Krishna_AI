'use client';

import { useLanguage } from "@/components/ClientLayout";
import ChapterBrowser from '@/components/ChapterBrowser';
import Image from 'next/image';

export default function ChaptersPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-row items-center justify-center mb-2 -ml-24">
        <Image
          src="/gita_book.png"
          alt="Bhagavad Gita"
          width={80}
          height={80}
          className="mr-2 -mt-4"
        />
        <h1 className={`text-3xl mb-4 font-bold ${language === 'jp' ? 'krishna-self_jp' : 'krishna-self'}`}>
        {language === 'jp' ? 'バガヴァッド・ギーターの章' : 'Chapters of the Bhagavad Gita'}
        </h1>
      </div>
      
      <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
        {language === 'jp' 
          ? 'バガヴァッド・ギーターの18章を探索し、各章の要約と重要な教えを発見してください。' 
          : 'Explore the 18 chapters of the Bhagavad Gita and discover the summary and key teachings of each chapter.'}
      </p>
      
      <ChapterBrowser language={language} />
    </div>
  );
}
