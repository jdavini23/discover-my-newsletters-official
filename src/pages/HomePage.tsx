import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';

// New Component Imports
import { HomeSearchBar } from '@/components/home/HomeSearchBar';
import { HomeFeatures } from '@/components/home/HomeFeatures';
import { HomeCTA } from '@/components/home/HomeCTA';
import { useAuthStore } from '@/stores/authStore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div 
      className='w-full min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden font-sans'
      role='main'
      aria-label='Newsletter Discovery Homepage'
    >
      {/* Hero Section with Enhanced Visual Hierarchy */}
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24'>
        <div className='w-full grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto py-16 lg:py-24'>
          {/* Left Column: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center lg:text-left space-y-6'
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
            <p 
              className='text-lg md:text-xl text-gray-600 mb-6'
              aria-description='Platform description'
            >
              Curate, explore, and dive into the most engaging newsletters tailored just for you.
            </p>

            <HomeSearchBar />

            <div className='mt-8 flex justify-center lg:justify-start space-x-4'>
              <button
                onClick={handleGetStarted}
                className='px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                aria-label={isAuthenticated ? 'Go to Profile' : 'Sign Up or Log In'}
              >
                {isAuthenticated ? 'My Profile' : 'Get Started'}
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/auth?mode=demo')}
                  className='px-6 py-3 bg-white text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                  aria-label='Try Demo'
                >
                  Try Demo
                </button>
              )}
            </div>
          </motion.div>

          {/* Right Column: Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='lg:flex justify-center items-center'
            aria-hidden='true'
          >
            <div className='w-full max-w-md'>
              <img
                src='/newsletter-illustration.svg'
                alt='Newsletter Discovery Illustration'
                className='w-full h-auto object-contain'
                loading='lazy'
              />
            </div>
          </motion.div>
        </div>
      </div>

      <HomeFeatures />
      <HomeCTA />
      <Footer />
    </div>
  );
};

export default HomePage;
