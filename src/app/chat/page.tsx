'use client';

import { useLanguage } from "@/components/ClientLayout";
import ChatInterface from '@/components/ChatInterface';
import Image from "next/image";

export default function ChatPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-row items-center justify-center mb-2 -ml-24">
        <Image
          src="/krishna_small_icon3.png"
          alt="Bhagavad Gita"
          width={80}
          height={80}
          className="mr-2 -mt-4"
        />
        <h1 className={`text-3xl font-bold mb-4 text-center ${language === 'jp' ? 'krishna-self_jp' : 'krishna-self'} max-[450px]:text-xl`}>
        {language === 'jp' ? 'クリシュナとの対話' : 'Conversation with Krishna'}
        </h1>
      </div>
      
      <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
        {language === 'jp' 
          ? 'バガヴァッド・ギーターの知恵に基づいて、クリシュナに質問や悩みを相談してください。' 
          : 'Ask Krishna your questions and concerns, drawing from the wisdom of the Bhagavad Gita.'}
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[70vh]">
        <ChatInterface language={language} />
      </div>
    </div>
  );
}
