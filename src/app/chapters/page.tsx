'use client';

import { useLanguage } from "@/components/ClientLayout";
import ChapterBrowser from '@/components/ChapterBrowser';

export default function ChaptersPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#584B40] dark:text-white">
        {language === 'jp' ? 'バガヴァッド・ギーターの章' : 'Chapters of the Bhagavad Gita'}
      </h1>
      
      <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
        {language === 'jp' 
          ? 'バガヴァッド・ギーターの18章を探索し、各章の要約と重要な教えを発見してください。' 
          : 'Explore the 18 chapters of the Bhagavad Gita and discover the summary and key teachings of each chapter.'}
      </p>
      
      <ChapterBrowser language={language} />
    </div>
  );
}
