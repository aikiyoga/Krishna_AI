'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import VerseDisplay from './VerseDisplay';
import { Verse } from '@/services/bhagavad-gita';
import Image from "next/image";

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
  const [showRelatedVerses, setShowRelatedVerses] = useState(true);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add effect to track window height
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    // Set initial height
    updateHeight();
    
    // Add event listener
    window.addEventListener('resize', updateHeight);
    
    // Clean up
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

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

  const headerText = language === 'jp' ? 'クリシュナの言葉：' : 'Krishna\'s Words:';

  const handleCopyToClipboard = async (index: number) => {
    try {
      const textToCopy = headerText + '\n' + messages[index].content;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedMessageIndex(index);
      setTimeout(() => setCopiedMessageIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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
              className={`max-w-[80%] rounded-lg p-3 relative ${
                message.role === 'user' 
                  ? 'bg-[#008080E6] text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
              }`}
            >
              {message.role === 'assistant' && index > 0 && (
                <button 
                  onClick={() => {
                    handleCopyToClipboard(index);
                    /*navigator.clipboard.writeText(message.content);
                    setCopiedMessageIndex(index);
                    setTimeout(() => setCopiedMessageIndex(null), 2000);*/
                  }}
                  className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Copy to clipboard"
                >
                  {copiedMessageIndex === index ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              )}
              <div className={`flex rounded ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} >
                {windowHeight > 1000 && (
                  <Image
                    src={`${message.role === 'user' ? '/icon_arjuna.png' : '/icon_krishna.png'}`}
                    alt={`${message.role === 'user' ? 'Arjuna' : 'Lord Krishna'}`}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                )}
                { windowHeight <= 1000 && (
                  <span className="font-sans italic font-bold">{message.role === 'user' ? 'You' : 'Lord Krishna'}</span>
                )}
              </div>
              <ReactMarkdown
                disallowedElements={['script', 'iframe', 'object', 'embed', 'form']}
                unwrapDisallowed={true}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} rel="noopener noreferrer" target="_blank" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
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
          <h3 className="text-sm font-medium cursor-pointer"
            onClick={() => setShowRelatedVerses(!showRelatedVerses)}>
            {language === 'jp' ? `関連する節${showRelatedVerses ? '' : 'を表示'}` : `${showRelatedVerses ? '' : 'Show '}Related Verses`}
          </h3>
          <div className={`mt-2 space-y-2 max-h-[150px] overflow-y-auto pr-2 ${showRelatedVerses ? '' : 'hidden'}`}>
            {relatedVerses.map((verse) => (
              <VerseDisplay 
                key={`${verse.chapter}-${verse.verse}`} 
                verse={verse} 
                language={language}
                compact={windowHeight <= 1000}
                insights={true}
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
            className="bg-[#008080E6] hover:bg-[#00a2a2] text-white rounded-full px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#008080E6] disabled:opacity-50"
          >
            {language === 'jp' ? "送信" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
