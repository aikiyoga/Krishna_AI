'use client';

import { useState } from 'react';
import { Verse } from '@/services/bhagavad-gita';
import VerseDisplay from './VerseDisplay';
import { GITA_THEMES } from '@/lib/verse-utils';

interface VerseSearchProps {
  language: 'en' | 'jp';
}

export default function VerseSearch({ language }: VerseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery && !selectedTheme) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let url = '/api/search?language=' + language;
      
      if (selectedTheme) {
        url += `&theme=${encodeURIComponent(selectedTheme)}`;
      } else if (searchQuery) {
        url += `&q=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.results);
      
      if (data.results.length === 0) {
        setError(language === 'jp' 
          ? '検索結果が見つかりませんでした。別のキーワードをお試しください。' 
          : 'No results found. Try a different search term.');
      }
    } catch (err) {
      console.error('Error searching verses:', err);
      setError(language === 'jp' 
        ? '検索中にエラーが発生しました。' 
        : 'An error occurred while searching.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme === selectedTheme ? null : theme);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            {language === 'jp' ? '節を検索' : 'Search Verses'}
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedTheme(null);
            }}
            placeholder={language === 'jp' ? 'キーワードを入力...' : 'Enter keywords...'}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#008080E6] dark:bg-gray-800"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <p className="block text-sm font-medium mb-2">
            {language === 'jp' ? 'または、テーマで探す' : 'Or Browse by Theme'}
          </p>
          <div className="flex flex-wrap gap-2">
            {GITA_THEMES.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => handleThemeSelect(theme)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedTheme === theme
                    ? 'bg-[#008080E6] text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || (!searchQuery && !selectedTheme)}
          className="px-4 py-2 bg-[#008080E6] hover:bg-[#00a2a2] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080E6] disabled:opacity-50"
        >
          {isLoading 
            ? (language === 'jp' ? '検索中...' : 'Searching...') 
            : (language === 'jp' ? '検索' : 'Search')}
        </button>
      </form>
      
      {error && (
        <p className="text-red-500">{error}</p>
      )}
      
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {language === 'jp' 
              ? `検索結果: ${searchResults.length}件` 
              : `Search Results: ${searchResults.length} verses`}
          </h2>
          
          <div className="space-y-4">
            {searchResults.map((verse) => (
              <VerseDisplay 
                key={`${verse.chapter}-${verse.verse}`} 
                verse={verse} 
                language={language} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
