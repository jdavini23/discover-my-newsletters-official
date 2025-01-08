import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResponsive } from '../../hooks/useResponsive';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

// Icons
import {
  HomeIcon,
  MagnifyingGlassIcon as SearchIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon as LoginIcon,
  ArrowLeftOnRectangleIcon as LogoutIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { name: 'Home', path: '/', icon: HomeIcon },
        { name: 'Discover', path: '/newsletters', icon: SearchIcon },
        { name: 'Profile', path: '/profile', icon: UserCircleIcon },
      ]
    : [
        { name: 'Welcome', path: '/welcome', icon: HomeIcon },
        { name: 'Login', path: '/auth', icon: LoginIcon },
      ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      x: '100%',
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-dark-background shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center">
          <div className='w-10 h-10 bg-[#FF7E5F] rounded-lg flex items-center justify-center mr-2'>
            <span className='text-white font-bold text-xl'>D</span>
          </div>
          <span className='text-xl font-bold text-gray-800 hidden md:inline'>
            Discover My Newsletters
          </span>
        </Link>

        {isMobile ? (
          <button 
            onClick={toggleMobileMenu} 
            className="text-gray-600 hover:text-primary-600 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        ) : (
          <div className="ml-10 flex items-baseline space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className='text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center'
              >
                {React.createElement(link.icon, { className: 'w-5 h-5 mr-2' })}
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className='text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center'
              >
                <LogoutIcon className='w-5 h-5 mr-2' />
                Logout
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className="fixed top-16 right-0 w-64 bg-white dark:bg-dark-background shadow-lg h-full"
            >
              <div className="flex flex-col p-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMobileMenu}
                    className='text-gray-600 hover:bg-gray-100 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center'
                  >
                    {React.createElement(link.icon, { className: 'w-5 h-5 mr-2' })}
                    {link.name}
                  </Link>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className='text-gray-600 hover:bg-gray-100 hover:text-gray-900 block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center'
                  >
                    <LogoutIcon className='w-5 h-5 mr-2' />
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;
