import { React } from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  showDarkModeToggle?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  showDarkModeToggle = true,
}) => {
  return (
    <div
      className={`
        min-h-screen 
        w-full 
        bg-white 
        dark:bg-dark-background 
        text-gray-900 
        dark:text-dark-text 
        transition-colors 
        duration-300 
        ${className}
      `}
    >
      {showDarkModeToggle && (
        <div className='fixed top-4 right-4 z-50'>
          <DarkModeToggle />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='
          container 
          mx-auto 
          px-4 
          sm:px-6 
          lg:px-8 
          max-w-7xl 
          space-y-8
        '
      >
        {children}
      </motion.div>
    </div>
  );
};
