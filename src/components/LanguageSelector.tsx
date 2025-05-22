'use client';

interface LanguageSelectorProps {
  language: 'en' | 'jp';
  setLanguage: (language: 'en' | 'jp') => void;
}

export default function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('jp')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          language === 'jp'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        日本語
      </button>
    </div>
  );
}
