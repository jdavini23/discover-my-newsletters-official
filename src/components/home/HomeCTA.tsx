import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const HomeCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};
