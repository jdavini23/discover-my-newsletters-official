import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeCTA } from '@/components/home/HomeCTA';
import { HomeFeatures } from '@/components/home/HomeFeatures';
// New Component Imports
import { HomeSearchBar } from '@/components/home/HomeSearchBar';
import { useAuthStore } from '@/stores/authStore';

import Footer from '../components/common/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div
      className={`w-full min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden font-sans transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role='main'
      aria-label='Newsletter Discovery Homepage'
    >
      {/* Hero Section with Enhanced Visual Hierarchy */}
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24'>
        <div className='w-full grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto py-16 lg:py-24'>
          {/* Left Column: Hero Text */}
          <div
            className={`text-center lg:text-left space-y-6 transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <h1
              className='text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight'
              aria-level={1}
            >
              Discover Your Perfect <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400'>
                Newsletter Companion
              </span>
            </h1>
            <p className='text-lg md:text-xl text-gray-600 mb-6' aria-label='Tagline description'>
              Curate your digital reading experience with personalized newsletter recommendations
              tailored to your interests.
            </p>
            <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start'>
              <button
                onClick={handleGetStarted}
                className='btn-primary bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-300 px-6 py-3 rounded-lg font-semibold'
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/newsletters')}
                className='btn-secondary border border-primary-600 text-primary-600 hover:bg-primary-50 transition-colors duration-300 px-6 py-3 rounded-lg font-semibold'
              >
                Explore Newsletters
              </button>
            </div>
          </div>

          {/* Right Column: Hero Image or Illustration */}
          <div
            className={`hidden lg:flex justify-center items-center transition-all duration-1000 transform ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            {/* Placeholder for hero image or illustration */}
            <div className='w-full max-w-md aspect-square bg-primary-100 rounded-full opacity-70'></div>
          </div>
        </div>
      </div>

      {/* Home Search Bar */}
      <HomeSearchBar />

      {/* Home Features */}
      <HomeFeatures />

      {/* Home CTA */}
      <HomeCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
