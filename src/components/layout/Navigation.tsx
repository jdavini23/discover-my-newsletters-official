import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <nav className='bg-white shadow-md fixed top-0 left-0 right-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/' className='flex-shrink-0 flex items-center'>
              <div className='w-10 h-10 bg-[#FF7E5F] rounded-lg flex items-center justify-center mr-2'>
                <span className='text-white font-bold text-xl'>D</span>
              </div>
              <span className='text-xl font-bold text-gray-800 hidden md:inline'>
                Discover My Newsletters
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
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
          </div>

          {/* Mobile Menu Toggle */}
          <div className='flex md:hidden'>
            <button
              onClick={toggleMobileMenu}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            >
              {isMobileMenuOpen ? (
                <XIcon className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <MenuIcon className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='md:hidden'
          >
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
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
    </nav>
  );
};

export default Navigation;
