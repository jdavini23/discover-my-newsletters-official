import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon, 
  LightBulbIcon, 
  RocketLaunchIcon,
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
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/newsletters' : '/auth');
  };

  const handleExplore = () => {
    navigate('/newsletters');
  };

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

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
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

          {/* Email Signup */}
          <motion.div 
            variants={itemVariants}
            className="max-w-md mx-auto relative"
          >
            <div className="flex shadow-md rounded-full overflow-hidden">
              <div className="flex-grow">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for updates"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-none text-gray-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>
              <button 
                onClick={handleEmailSubscribe}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 
                  hover:from-purple-700 hover:to-blue-600 transition-all 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <EnvelopeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
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
      </div>
    </div>
  );
};

export default HomePage;
