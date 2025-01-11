interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  showDarkModeToggle?: boolean;
}
type;
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  showDarkModeToggle = true,
}) => {
  const { isMobile } = useResponsive();
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
        <div
          className={`
          fixed 
          ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} 
          z-50
        `}
        >
          <DarkModeToggle />
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};
import type { GlobalTypes } from '@/types/global';
import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { DarkModeToggle } from '../ui/DarkModeToggle';
