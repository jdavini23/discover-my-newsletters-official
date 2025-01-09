import React, { useEffect, useState } from 'react';

export const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileTap={{ scale: 0.9 }}
      className='
        p-2 
        rounded-full 
        bg-gray-100 
        dark:bg-gray-800 
        text-gray-800 
        dark:text-gray-200 
        hover:bg-gray-200 
        dark:hover:bg-gray-700 
        transition-colors 
        duration-300
      '
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDarkMode ? (
          <SunIcon className='h-6 w-6 text-yellow-500' />
        ) : (
          <MoonIcon className='h-6 w-6 text-indigo-600' />
        )}
      </motion.div>
    </motion.button>
  );
};
