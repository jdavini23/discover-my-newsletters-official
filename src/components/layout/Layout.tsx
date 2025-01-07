import React, { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300'>
      <Navigation />
      <main className='pt-16 container mx-auto px-4 sm:px-6 lg:px-8'>{children}</main>
    </div>
  );
};

export default Layout;
