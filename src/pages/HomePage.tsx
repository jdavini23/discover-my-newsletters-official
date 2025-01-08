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
      <div className="w-full">
        <div className="w-full grid lg:grid-cols-2 gap-8 items-center px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24">
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
      <div className="w-full bg-white">
        <div className="w-full grid md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8 py-16">
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
      <div className="w-full bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16 text-center">
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
      <footer className="w-full bg-gray-900 text-white py-16">
        <div className="w-full">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Tagline */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-500">
                Discover My Newsletters
              </h2>
              <p className="text-gray-400 mb-4">
                Curating the world's most engaging newsletters, one click at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <nav className="space-y-2">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Newsletter Discovery', path: '/newsletters' },
                  { label: 'Profile', path: '/profile' },
                  { label: 'Blog', path: '/blog' },
                  { label: 'About Us', path: '/about' }
                ].map(({ label, path }) => (
                  <Link 
                    key={path}
                    to={path} 
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {[
                  { 
                    href: 'https://twitter.com/discovernews', 
                    svg: () => (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    )
                  },
                  { 
                    href: 'https://linkedin.com/company/discovernewsletters', 
                    svg: () => (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                      </svg>
                    )
                  },
                  { 
                    href: 'https://github.com/discovernewsletters', 
                    svg: () => (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )
                  }
                ].map(({ href, svg: SvgIcon }) => (
                  <a 
                    key={href}
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    <SvgIcon />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact and Legal */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <a 
                  href="mailto:support@discovernewsletters.com" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="mr-2 h-5 w-5">
                    <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 4.712v-9.458l4.623 4.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 4.564 4.625h-16.788l4.57-4.62zm9.208-1.264l4.616-4.712v9.458l-4.616-4.746z"/>
                  </svg>
                  support@discovernewsletters.com
                </a>
                <Link 
                  to="/support" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  Support Form
                </Link>
                <Link 
                  to="/terms" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/privacy" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Discover My Newsletters. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
