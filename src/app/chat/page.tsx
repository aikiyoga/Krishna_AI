'use client';

import { useLanguage } from "@/components/ClientLayout";
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#584B40] dark:text-white">
        {language === 'jp' ? 'クリシュナとの対話' : 'Conversation with Krishna'}
      </h1>
      
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
