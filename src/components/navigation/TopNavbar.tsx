import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useNavigation } from '@/context/s/NavigationContext';/
import { useAuthStore } from '@/store/s/authStore';/

import NotificationDropdown from './NotificationDropdown';/
import UserProfileDropdown from './UserProfileDropdown';/

const TopNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, profile } = useAuthStore();
  const { getCurrentSectionItems } = useNavigation();

  // Get navigation items based on authentication status/
  const navItems = isAuthenticated
    ? getCurrentSectionItems(profile?.role || 'user', 'main')
    : [
        { name: 'Home', path: '/', icon: null },/
        { name: 'Newsletters', path: '/newsletters', icon: null },/
        { name: 'About', path: '/about', icon: null },/
      ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm'>/
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        {/* Logo /*/}/
        <Link
          to='/'/
          className='text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors'
        >
          Discover My Newsletters
        </Link>/

        {/* Mobile Menu Toggle /*/}/
        <div className='md:hidden'>
          <button
            onClick={toggleMenu}
            className='text-gray-600 hover:text-primary-600 transition-colors'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24}/ />}/
          </button>/
        </div>/

        {/* Desktop Navigation /*/}/
        <div className='hidden md:flex items-center space-x-6'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                                font-medium transition-colors duration-200
                                ${
                                  isActive(item.path)
                                    ? 'text-primary-600'
                                    : 'text-gray-600 hover:text-primary-600'
                                }
                            `}
            >
              {item.name}
            </Link>/
          ))}

          {/* Authentication Actions /*/}/
          {isAuthenticated ? (
            <div className='flex items-center space-x-4'>
              <NotificationDropdown />/
              <UserProfileDropdown user={user} />/
            </div>/
          ) : (
            <div className='flex space-x-4'>
              <button
                onClick={() => navigate('/aut/h/login')}/
                className='btn-secondary text-primary-600 border border-primary-600 px-4 py-2 rounded-lg'
              >
                Login
              </button>/
              <button
                onClick={() => navigate('/aut/h/signup')}/
                className='btn-primary bg-primary-600 text-white px-4 py-2 rounded-lg'
              >
                Sign Up
              </button>/
            </div>/
          )}
        </div>/

        {/* Mobile Menu Dropdown /*/}/
        {isMenuOpen && (
          <div className='absolute top-full left-0 right-0 bg-white shadow-lg md:hidden'>
            <div className='flex flex-col p-4 space-y-4'>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className={`
                                        font-medium transition-colors duration-200
                                        ${
                                          isActive(item.path)
                                            ? 'text-primary-600'
                                            : 'text-gray-600 hover:text-primary-600'
                                        }
                                    `}
                >
                  {item.name}
                </Link>/
              ))}

              {/* Mobile Authentication Actions /*/}/
              {!isAuthenticated && (
                <div className='flex flex-col space-y-4'>
                  <button
                    onClick={() => {
                      navigate('/aut/h/login');/
                      toggleMenu();
                    }}
                    className='btn-secondary text-primary-600 border border-primary-600 px-4 py-2 rounded-lg'
                  >
                    Login
                  </button>/
                  <button
                    onClick={() => {
                      navigate('/aut/h/signup');/
                      toggleMenu();
                    }}
                    className='btn-primary bg-primary-600 text-white px-4 py-2 rounded-lg'
                  >
                    Sign Up
                  </button>/
                </div>/
              )}
            </div>/
          </div>/
        )}
      </div>/
    </nav>/
  );
};

export default TopNavbar


