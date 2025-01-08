import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/common/Footer';

// New Component Imports
import { HomeSearchBar } from '@/components/home/HomeSearchBar';
import { HomeFeatures } from '@/components/home/HomeFeatures';
import { HomeCTA } from '@/components/home/HomeCTA';

const HomePage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden font-sans">
      {/* Hero Section with Enhanced Visual Hierarchy */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        <div className="w-full grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto py-16 lg:py-24">
          {/* Left Column: Hero Text */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Discover Your Perfect <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                Newsletter Companion
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              Curate, explore, and dive into the most engaging newsletters tailored just for you.
            </p>

            <HomeSearchBar />
          </motion.div>

          {/* Right Column: Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:flex justify-center items-center"
          >
            <div className="w-full max-w-md">
              <img 
                src="/newsletter-illustration.svg" 
                alt="Newsletter Discovery Illustration" 
                className="w-full h-auto object-contain"
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
