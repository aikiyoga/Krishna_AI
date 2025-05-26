'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import VerseDisplay from './VerseDisplay';
import { Verse } from '@/services/bhagavad-gita';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatInterfaceProps {
  language: 'en' | 'jp';
}

export default function ChatInterface({ language }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [relatedVerses, setRelatedVerses] = useState<Verse[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting from Krishna
  useEffect(() => {
    const initialGreeting = language === 'jp'
      ? "私はクリシュナ、バガヴァッド・ギーターの神聖な導き手です。あなたの質問や悩みに、ギーターの知恵に基づいて答えましょう。何について話したいですか？"
      : "I am Krishna, the divine guide from the Bhagavad Gita. I am here to answer your questions and concerns with the wisdom of the Gita. What would you like to discuss?";
    
    setMessages([{ role: 'assistant', content: initialGreeting }]);
  }, [language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      // Add Krishna's response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      
      // Set related verses if any
      if (data.verses && data.verses.length > 0) {
        setRelatedVerses(data.verses);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = language === 'jp'
        ? "申し訳ありません、エラーが発生しました。もう一度お試しください。"
        : "I apologize, but there was an error. Please try again.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-[#008080E6] text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 dark:bg-gray-700 dark:text-white">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Related verses */}
      {relatedVerses.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <h3 className="text-sm font-medium mb-2">
            {language === 'jp' ? '関連する節' : 'Related Verses'}
          </h3>
          <div className="space-y-2">
            {relatedVerses.map((verse) => (
              <VerseDisplay 
                key={`${verse.chapter}-${verse.verse}`} 
                verse={verse} 
                language={language}
                compact
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'jp' ? "クリシュナに質問する..." : "Ask Krishna..."}
            className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#008080E6] dark:bg-gray-800 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#008080E6] hover:bg-[#008080C0] text-white rounded-full px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#008080E6] disabled:opacity-50"
          >
            {language === 'jp' ? "送信" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
