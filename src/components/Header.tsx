import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { themeColor } = useTheme();
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animation for glow effect
  useEffect(() => {
    // Start with a blur effect
    setIsVisible(true);
    
    // Glow animation interval
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => (prev === 20 ? 10 : 20));
    }, 2000);

    return () => clearInterval(glowInterval);
  }, []);

  return (
    <header className="w-full py-6 px-4 sm:px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center"
      >
        <motion.div 
          className="w-12 h-12 rounded-xl flex items-center justify-center mr-3 relative"
          style={{ backgroundColor: `${themeColor}40` }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div 
            className="absolute inset-0 rounded-xl"
            animate={{ 
              boxShadow: `0 0 ${glowIntensity}px ${themeColor}` 
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <BookOpenIcon className="w-7 h-7 text-white relative z-10" />
        </motion.div>
        
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-white font-bold text-xl sm:text-2xl"
                style={{ 
                  textShadow: `0 0 ${glowIntensity}px ${themeColor}` 
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                AI-Powered Book Summarizer
              </motion.h1>
              <motion.p 
                className="text-white/60 text-xs text-center sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Powered by Gemini AI
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
