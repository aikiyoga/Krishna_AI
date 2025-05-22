'use client';

import { useLanguage } from "@/components/ClientLayout";
import Image from "next/image";
import Link from "next/link";
import DailyWisdom from "@/components/DailyWisdom";

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#584B40] dark:text-white">
            {language === 'jp'
              ? 'クリシュナAI'
              : 'Krishna AI'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {language === 'jp'
              ? 'バガヴァッド・ギーターの神聖な導き手'
              : 'The Divine Guide to the Bhagavad Gita'}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'jp'
              ? 'クリシュナAIは、バガヴァッド・ギーターの知恵を通じて、あなたの人生の旅路を導く仮想ガイドです。クリシュナの視点から、古代の知恵を現代の課題に適用します。'
              : 'Krishna AI is a virtual guide to help you navigate life\'s journey through the wisdom of the Bhagavad Gita. Experience ancient wisdom applied to modern challenges, from the perspective of Lord Krishna.'}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/chat"
              className="px-6 py-3 bg-[#008080E6] text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              {language === 'jp' ? 'クリシュナと話す' : 'Talk to Krishna'}
            </Link>
            <Link
              href="/chapters"
              className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              {language === 'jp' ? 'ギーターを探索する' : 'Explore the Gita'}
            </Link>
          </div>
        </div>

        <div className="relative h-80 sm:h-96 lg:h-120 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="/krishna.jpg"
            alt="Lord Krishna"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-[#584B40] dark:text-white">
          {language === 'jp' ? '今日の知恵' : 'Today\'s Wisdom'}
        </h2>
        <DailyWisdom language={language} />
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#FFEBCC] dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {language === 'jp' ? '多言語サポート' : 'Multilingual Support'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'jp'
              ? '英語と日本語の両方で完全な機能を提供し、言語間をシームレスに切り替えることができます。'
              : 'Full functionality in both English and Japanese, with seamless switching between languages.'}
          </p>
        </div>

        <div className="bg-[#FFEBCC] dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {language === 'jp' ? '節の文脈と解説' : 'Verse Context & Commentary'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'jp'
              ? '要求に応じて節の詳細な説明を提供し、歴史的および哲学的な文脈を含みます。'
              : 'Detailed explanations of verses when requested, including historical and philosophical context.'}
          </p>
        </div>

        <div className="bg-[#FFEBCC] dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {language === 'jp' ? 'パーソナライズされたガイダンス' : 'Personalized Guidance'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'jp'
              ? 'ユーザーが個人的な状況を説明し、関連するギーターの教えに基づいたガイダンスを受けることができます。'
              : 'Describe your personal situations and receive guidance based on relevant Gita teachings.'}
          </p>
        </div>
      </div>
    </div>
  );
}
