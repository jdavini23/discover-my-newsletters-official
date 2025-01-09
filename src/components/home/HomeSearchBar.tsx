import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

export const HomeSearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate('/newsletters', { state: { initialSearch: searchQuery } });
      }
    },
    [searchQuery, navigate]
  );

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className='relative w-full max-w-xl mx-auto lg:mx-0'>
      <form onSubmit={handleSearch} className='flex w-full group'>
        <div className='relative flex-grow'>
          <motion.div
            className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: isFocused ? 0.7 : 0.5,
              x: isFocused ? 0 : -10,
            }}
            transition={{ duration: 0.3 }}
          >
            <Search className='h-5 w-5 text-primary-500 transition-colors' />
          </motion.div>

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
              bg-white/80 backdrop-blur-sm 
              rounded-l-xl rounded-r-xl 
              focus:outline-none 
              focus:ring-2 focus:ring-primary/30 
              focus:border-primary 
              text-sm 
              shadow-md 
              group-hover:shadow-lg 
              transition-all 
              duration-300 
              ease-in-out
            '
          />

          <AnimatePresence>
            {searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className='absolute right-3 top-1/2 -translate-y-1/2'
              >
                <Sparkles className='h-5 w-5 text-primary-600 animate-pulse' aria-hidden='true' />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type='submit'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
          '
        >
          <Sparkles className='h-5 w-5 opacity-70' />
          Discover
        </motion.button>
      </form>

      {/* Playful background effect */}
      <motion.div
        className='
          absolute 
          -z-10 
          top-0 
          left-0 
          right-0 
          bottom-0 
          bg-gradient-to-br 
          from-primary-50/30 
          to-primary-100/30 
          rounded-xl 
          opacity-0 
          group-hover:opacity-100 
          transition-opacity 
          duration-500
        '
        initial={{ opacity: 0 }}
        animate={{
          opacity: isFocused ? 0.5 : 0,
          scale: isFocused ? 1.02 : 1,
        }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};
