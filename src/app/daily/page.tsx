'use client';

import { useLanguage } from "@/components/ClientLayout";
import DailyWisdom from '@/components/DailyWisdom';

export default function DailyWisdomPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {language === 'jp' ? '今日の知恵' : 'Daily Wisdom'}
      </h1>
      
      <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
        {language === 'jp' 
          ? '毎日、バガヴァッド・ギーターからの洞察と知恵を受け取りましょう。' 
          : 'Receive daily insights and wisdom from the Bhagavad Gita.'}
      </p>
      
      <DailyWisdom language={language} />
      
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {language === 'jp' ? '日々の実践' : 'Daily Practice'}
        </h2>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {language === 'jp' 
            ? 'バガヴァッド・ギーターの教えを日常生活に取り入れるための提案：' 
            : 'Suggestions for incorporating the teachings of the Bhagavad Gita into your daily life:'}
        </p>
        
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            {language === 'jp' 
              ? '朝の瞑想：今日の節について5分間静かに考えてみましょう。' 
              : 'Morning meditation: Spend 5 minutes quietly reflecting on today\'s verse.'}
          </li>
          <li>
            {language === 'jp' 
              ? '意識的な行動：今日の教えを念頭に置いて行動してみましょう。' 
              : 'Mindful action: Keep today\'s teaching in mind as you go about your day.'}
          </li>
          <li>
            {language === 'jp' 
              ? '夕方の振り返り：今日の教えをどのように適用できたか振り返りましょう。' 
              : 'Evening reflection: Reflect on how you were able to apply today\'s teaching.'}
          </li>
          <li>
            {language === 'jp' 
              ? '知恵の共有：今日の洞察を友人や家族と共有してみましょう。' 
              : 'Share the wisdom: Share today\'s insight with a friend or family member.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
