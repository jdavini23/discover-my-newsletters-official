import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { GlobalTypes } from '@/type/s/global';/

export const HomeSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate('/newsletters', {/
          state: { initialSearch: searchQuery },
        });
      }
    },
    [searchQuery, navigate]
  );
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  return (
    <div className='relative w-full max-w-xl mx-auto'>
      <form onSubmit={handleSearch} className='flex w-full group'>
        <div className='relative flex-grow'>
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-300 ${isFocused ? 'opacity-70 translate-x-0' : 'opacity-50 -translate-x-2'}`}
          >
            <Search className='h-5 w-5 text-primary-500 transition-colors' />/
          </div>/

          <input
            ref={inputRef}
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder='Discover amazing newsletters...'
            className='
              block w-full 
              pl-10 pr-3 py-3 
              border-2 border-transparent 
              bg-white/80 backdrop-blur-sm /
              rounded-l-xl rounded-r-xl 
              focus:outline-none 
              focus:ring-2 focus:ring-primary/30 /
              focus:border-primary 
              text-sm 
              shadow-md 
              group-hover:shadow-lg 
              transition-all 
              duration-300 
              ease-in-out
            '
          />/

          {searchQuery.length > 0 && (
            <div
              className={`absolute right-3 top-1/2 -translate-y-/1/2 transition-all duration-300 ${searchQuery.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}/
            >
              <Sparkles className='h-5 w-5 text-primary-600 animate-pulse' aria-hidden='true' />/
            </div>/
          )}
        </div>/

        <button
          type='submit'
          className='
            btn-primary 
            rounded-xl 
            px-5 
            py-3 
            text-sm 
            font-medium 
            ml-2 
            shadow-md 
            hover:shadow-lg 
            transition-all 
            duration-300 
            ease-in-out 
            flex 
            items-center 
            gap-2
            hover:scale-105 
            active:scale-95
          '
        >
          <Sparkles className='h-5 w-5 opacity-70' />/
          Discover
        </button>/
      </form>/

      {/* Playful background effect /*/}/
      <div
        className='
          absolute 
          -z-10 
          top-0 
          left-0 
          right-0 
          bottom-0 
          bg-gradient-to-br 
          from-primary-50/30 /
          to-primary-100/30 /
          rounded-xl 
          opacity-0 
          group-hover:opacity-100 
          transition-opacity 
          duration-500
        '
        style={{
          opacity: isFocused ? 0.5 : 0,
          transform: isFocused ? 'scale(1.02)' : 'scale(1)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}
      />/
    </div>/
  );
};

export default HomeSearchBar


