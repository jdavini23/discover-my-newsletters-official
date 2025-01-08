import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  ArchiveBoxIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { toast } from '@/lib/react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import Footer from '../components/common/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/newsletters', { state: { initialSearch: searchQuery } });
    }
  }, [searchQuery, navigate]);

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

            {/* Search Bar with Enhanced CTA */}
            <form onSubmit={handleSearch} className="flex max-w-xl mx-auto lg:mx-0">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search newsletters by topic, name, or category" 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-primary/50 focus:border-primary text-sm"
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary rounded-r-lg px-4 py-2 text-sm font-medium"
              >
                Discover
              </button>
            </form>
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

      {/* Features Section */}
      <div className="w-full bg-white px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        <div className="w-full max-w-7xl mx-auto grid md:grid-cols-3 gap-8 py-16">
          {/* Feature 1 */}
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                <SparklesIcon className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Curated Selection</h3>
            <p className="text-gray-600">
              Handpicked newsletters across diverse topics, ensuring quality and relevance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                <RocketLaunchIcon className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Quick Discovery</h3>
            <p className="text-gray-600">
              Advanced search and smart filters to find your perfect newsletter in seconds.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 text-primary-600 p-3 rounded-full">
                <LightBulbIcon className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Personalized Insights</h3>
            <p className="text-gray-600">
              AI-powered recommendations tailored to your interests and reading preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full bg-gradient-to-r from-primary-600 to-primary-500 px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        <div className="w-full max-w-7xl mx-auto py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Start Your Newsletter Journey Today
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of curious minds discovering incredible newsletters that spark inspiration, knowledge, and joy.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => navigate('/newsletters')}
                className="btn-primary bg-white text-primary-600 hover:bg-primary-50 transition-colors duration-300 px-6 py-3 rounded-lg font-semibold"
              >
                Explore Newsletters
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="btn-secondary bg-transparent border border-white/30 text-white hover:bg-white/10 transition-colors duration-300 px-6 py-3 rounded-lg font-semibold"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />

    </div>
  );
};

export default HomePage;
