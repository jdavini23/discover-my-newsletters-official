import React, { ReactNode } from 'react';

import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-background dark:bg-gray-900 transition-colors duration-300'>
      <Navigation />
      <main className='w-full pt-16 px-0 sm:px-0 lg:px-0'>{children}</main>
    </div>
  );
};

export default Layout;
