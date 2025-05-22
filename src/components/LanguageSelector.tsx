'use client';

import { useLanguage } from './ClientLayout';

interface LanguageSelectorProps {
  language: 'en' | 'jp';
  setLanguage: (language: 'en' | 'jp') => void;
}

export default function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  const handleLanguageChange = (newLanguage: 'en' | 'jp') => {
    localStorage.setItem('language', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          language === 'en'
            ? 'bg-[#008080E6] text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange('jp')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          language === 'jp'
            ? 'bg-[#008080E6] text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        日本語
      </button>
    </div>
  );
}
