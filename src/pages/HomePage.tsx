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
  PaperAirplaneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { toast } from '@/lib/react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    // Navigate to newsletter discovery page with search query
    navigate(`/newsletters?search=${encodeURIComponent(searchQuery.trim())}`);
  }, [searchQuery, navigate]);

  const features: Feature[] = [
    {
      title: 'Discover Newsletters',
      description: 'Find the best newsletters tailored to your interests',
      icon: SparklesIcon,
    },
    {
      title: 'Personalized Recommendations',
      description: 'Get curated newsletter suggestions based on your preferences',
      icon: LightBulbIcon,
    },
    {
      title: 'Effortless Exploration',
      description: 'Browse, filter, and track your favorite newsletters',
      icon: RocketLaunchIcon,
    }
  ];

  const platformFeatures: Feature[] = [
    {
      title: 'Personalized Recommendations',
      description: 'Get newsletters curated to match your interests.',
      icon: StarIcon,
    },
    {
      title: 'Advanced Filters',
      description: 'Easily sort newsletters by topics, ratings, and more.',
      icon: AdjustmentsHorizontalIcon,
    },
    {
      title: 'Seamless Management',
      description: 'Organize and track your subscriptions effortlessly.',
      icon: ArchiveBoxIcon,
    }
  ];

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/newsletters' : '/auth');
  };

  const handleExplore = () => {
    navigate('/newsletters');
  };

  const handleEmailSubscribe = useCallback(() => {
    if (!email) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    // TODO: Implement actual email subscription logic
    setTimeout(() => {
      toast.success("Thanks for your interest! We'll be in touch soon.");
      setEmail('');
      setIsSubmitting(false);
    }, 1500);
  }, [email]);

  // Framer Motion Variants for Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100 
      } 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
          >
            Discover Newsletters That{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              Spark Your Curiosity
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Explore, curate, and dive into the world's most engaging newsletters. 
            Find content that inspires, educates, and entertains.
          </motion.p>

          {/* Newsletter Search Bar */}
          <motion.div 
            variants={itemVariants}
            className="max-w-xl mx-auto relative"
          >
            <div className="flex shadow-lg rounded-full overflow-hidden">
              <div className="flex-grow">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search newsletters by topic, name, or category"
                  className="w-full px-4 py-3 border-none text-gray-700 focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 
                  hover:from-purple-700 hover:to-blue-600 transition-all 
                  flex items-center justify-center"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-10"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {isAuthenticated ? 'My Newsletters' : 'Get Started'}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplore}
              className="w-full sm:w-auto border-2 border-purple-500 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-all"
            >
              Explore Newsletters
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center group"
            >
              <feature.icon 
                className="w-16 h-16 mx-auto mb-4 text-purple-600 
                  group-hover:text-purple-700 group-hover:scale-110 transition-all" 
              />
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-purple-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mid-Page Call-to-Action Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-16 rounded-2xl shadow-xl"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              variants={itemVariants}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Join Thousands of Users in Discovering Amazing Newsletters!
              </h2>
              
              <p className="text-lg text-white/80 mb-10">
                Unlock a world of curated content, personalized recommendations, 
                and seamless newsletter management.
              </p>
              
              <div className="max-w-md mx-auto space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex shadow-lg rounded-full overflow-hidden"
                >
                  <div className="flex-grow">
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border-none text-gray-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>
                  <button 
                    onClick={handleEmailSubscribe}
                    disabled={isSubmitting}
                    className="bg-white text-purple-600 px-6 py-3 
                      hover:bg-gray-100 transition-all 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                  </button>
                </motion.div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="w-full bg-white text-purple-600 px-8 py-3 rounded-full font-semibold 
                    hover:bg-gray-100 transition-all"
                >
                  {isAuthenticated ? 'View My Newsletters' : 'Get Started Now'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Platform Features Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white py-16 rounded-2xl shadow-lg"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
            >
              Why Choose Discover My Newsletters?
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {platformFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-gray-50 p-6 rounded-xl text-center group hover:bg-purple-50 transition-all"
                >
                  <feature.icon 
                    className="w-16 h-16 mx-auto mb-6 text-purple-600 
                      group-hover:text-purple-700 group-hover:scale-110 transition-all" 
                  />
                  <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-purple-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Tagline */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
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
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  Home
                </Link>
                <Link 
                  to="/newsletters" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  Newsletter Discovery
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  Profile
                </Link>
                <Link 
                  to="/blog" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  Blog
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors block"
                >
                  About Us
                </Link>
              </nav>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com/discovernews" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/company/discovernewsletters" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/discovernewsletters" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
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
