'use client';

import { useState, ReactNode, createContext, useContext, useEffect } from 'react';
import Navigation from '@/components/Navigation';

// Create a context for language
export const LanguageContext = createContext<{
  language: 'en' | 'jp';
  setLanguage: (language: 'en' | 'jp') => void;
}>({ language: 'en', setLanguage: () => { } });

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

type ChildrenFunction = (props: { language: 'en' | 'jp' }) => ReactNode;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<'en' | 'jp'>('en');

  // Initialize language from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage === 'jp') {
      setLanguage('jp');
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen flex flex-col">
        <Navigation language={language} setLanguage={setLanguage} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {typeof children === 'function' ? (children as ChildrenFunction)({ language }) : children}
        </main>
        <footer className="bg-[#FFEBCC] dark:bg-gray-800 shadow-inner py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {language === 'jp'
              ? 'クリシュナAI - バガヴァッド・ギーターの知恵を通じた導き'
              : 'Krishna AI - Guidance through the wisdom of Bhagavad Gita'}
          </div>
          <div style={{ overflowWrap: 'break-word' }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-4">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', paddingBottom: '10px' }}>
              <span style={{ fontFamily: 'Verdana', fontWeight: 'bold' }}>
                Aiki Yoga
              </span>
              <a href="https://www.aiki-yoga.net/" style={{ textDecoration: 'none' }} title="Aiki Yoga Website">
                <img
                  src="https://www.aiki-yoga.net/assets/img/lotus-flower.png"
                  width="50"
                  style={{ opacity: 0.3 }}
                  alt="Aiki Yoga"
                />
              </a>
              <a href="https://www.instagram.com/aikimatsu.yoga" style={{ textDecoration: 'none' }} title="Aiki Yoga Instagram">
                <img
                  src="https://www.aiki-yoga.net/assets/img/instagram.png"
                  width="30"
                  style={{ opacity: 0.3 }}
                  alt="instagram"
                />
              </a>
              <a href="https://aikiyoga.substack.com" style={{ textDecoration: 'none' }} title="Aiki Yoga Substack">
                <img
                  src="https://www.aiki-yoga.net/assets/img/substack.png"
                  width="30"
                  style={{ opacity: 0.3 }}
                  alt="substack"
                />
              </a>
              <a href="https://x.com/aiki_yoga" style={{ textDecoration: 'none' }} title="Aiki Yoga Twitter/X">
                <img
                  src="https://www.aiki-yoga.net/assets/img/twitter-x.png"
                  width="30"
                  style={{ opacity: 0.3 }}
                  alt="Twitter/X"
                />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}
