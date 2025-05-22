'use client';

import { useState, ReactNode } from 'react';
import Navigation from '@/components/Navigation';

type ChildrenFunction = (props: { language: 'en' | 'jp' }) => ReactNode;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<'en' | 'jp'>('en');

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation language={language} setLanguage={setLanguage} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {typeof children === 'function' ? (children as ChildrenFunction)({ language }) : children}
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {language === 'jp'
            ? 'クリシュナAI - バガヴァッド・ギーターの知恵を通じた導き'
            : 'Krishna AI - Guidance through the wisdom of Bhagavad Gita'}
        </div>
      </footer>
    </div>
  );
}