import React from 'react';

import { useTheme } from '@/contexts/ThemeContext';

const AppearanceSection: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold mb-4'>Theme Preferences</h2>
      <div className='flex items-center justify-between'>
        <span className='text-gray-700 dark:text-gray-300'>Dark Mode</span>
        <button
          onClick={toggleTheme}
          className='px-4 py-2 bg-gray-200 dark:bg-dark-surface rounded-md hover:bg-gray-300 dark:hover:bg-dark-border transition'
        >
          {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        </button>
      </div>
    </div>
  );
};

export default AppearanceSection;
