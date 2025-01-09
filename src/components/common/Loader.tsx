import React from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/70">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1], 
          opacity: [0, 1, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="w-16 h-16 border-4 border-primary-500 border-t-primary-200 rounded-full"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute text-sm text-gray-600 dark:text-gray-300 mt-24"
      >
        Loading...
      </motion.span>
    </div>
  );
};

export default Loader;
