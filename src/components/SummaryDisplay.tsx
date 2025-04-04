import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';
import { DocumentTextIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface SummaryDisplayProps {
  summary: string | null;
  isLoading: boolean;
  bookTitle?: string;
}

export default function SummaryDisplay({ summary, isLoading, bookTitle }: SummaryDisplayProps) {
  // Get window height for responsive sizing
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Update window height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    // Initial height
    updateHeight();
    
    // Listen for resize events
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  const { themeColor } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle page navigation - no longer needed with single page
  const handlePageChange = (direction: 'prev' | 'next') => {
    // Navigation is disabled since we now have a single page
    return;
  };
  
  // No need to scroll between pages anymore
  useEffect(() => {
    // Reset scroll position when summary changes
    if (bookContainerRef.current) {
      bookContainerRef.current.scrollTop = 0;
    }
  }, [summary]);

  // Custom components for ReactMarkdown
  const components = {
    h1: ({ node, ...props }: any) => (
      <h1 
        className="text-2xl font-bold mb-6 pb-3 border-b border-white/20 tracking-wide" 
        style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}30` }} 
        {...props} 
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 
        className="text-xl font-semibold mt-8 mb-4 pb-2 border-b border-white/10" 
        style={{ color: themeColor, textShadow: `0 0 5px ${themeColor}20` }} 
        {...props} 
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 
        className="text-lg font-medium mt-6 mb-3" 
        style={{ color: themeColor }} 
        {...props} 
      />
    ),
    p: ({ node, ...props }: any) => (
      <p 
        className="text-white/90 mb-5 leading-relaxed text-sm md:text-base tracking-wide" 
        style={{ textShadow: '0 0 1px rgba(255,255,255,0.1)' }}
        {...props} 
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul 
        className="list-none pl-0 mb-6 space-y-3" 
        {...props} 
      />
    ),
    ol: ({ node, ...props }: any) => (
      <ol 
        className="list-decimal pl-5 mb-6 space-y-3" 
        {...props} 
      />
    ),
    li: ({ node, ...props }: any) => (
      <li 
        className="text-white/90 leading-relaxed pl-6 relative flex items-start mb-2" 
        style={{ textShadow: '0 0 1px rgba(255,255,255,0.1)' }}
        {...props} 
      >
        <div 
          className="absolute left-0 top-2.5 w-2 h-2 rounded-full mr-3" 
          style={{ 
            backgroundColor: themeColor,
            boxShadow: `0 0 6px ${themeColor}80`,
          }}
        />
        <div className="flex-1">{props.children}</div>
      </li>
    ),
    strong: ({ node, ...props }: any) => (
      <strong 
        className="font-semibold" 
        style={{ color: themeColor, textShadow: `0 0 5px ${themeColor}30` }} 
        {...props} 
      />
    ),
    em: ({ node, ...props }: any) => (
      <em 
        className="italic text-white/90" 
        style={{ textShadow: '0 0 2px rgba(255,255,255,0.2)' }}
        {...props} 
      />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote 
        className="border-l-4 pl-4 py-2 my-6 text-white/80 bg-white/5 rounded-r-lg" 
        style={{ borderColor: `${themeColor}80` }} 
        {...props} 
      />
    ),
    hr: ({ node, ...props }: any) => (
      <hr 
        className="my-8 border-0 h-px" 
        style={{ background: `linear-gradient(to right, transparent, ${themeColor}50, transparent)` }}
        {...props} 
      />
    ),
  };

  if (isLoading) {
    return (
      <GlassCard className="w-full h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mb-4"
            style={{ borderColor: `${themeColor}80`, borderTopColor: 'transparent' }} />
          <h3 className="text-white font-medium text-lg mb-2">Generating Summary</h3>
          <p className="text-white/60 text-sm text-center max-w-md">
            We're analyzing your book and creating a comprehensive summary. This may take a moment for larger books.
          </p>
        </div>
      </GlassCard>
    );
  }

  if (!summary) {
    return (
      <GlassCard className="w-full h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColor}20` }}>
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">No Summary Yet</h3>
          <p className="text-white/60 text-sm text-center max-w-md">
            Upload a book and customize your summary options to generate a summary.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full flex flex-col" style={{ height: '830px', minHeight: '830px', overflow: 'hidden' }}>
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
            style={{ backgroundColor: `${themeColor}20` }}>
            <DocumentTextIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">
              {bookTitle ? `Summary: ${bookTitle}` : 'Book Summary'}
            </h2>
            <p className="text-white/60 text-xs">Generated with Gemini AI</p>
          </div>
        </div>
        
        {/* Book navigation controls */}
        <div className="flex space-x-2">
          <button 
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 0}
            className={`book-nav-button ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeftIcon className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={() => handlePageChange('next')}
            disabled={currentPage === (summary ? 2 : 0)}
            className={`book-nav-button ${currentPage === (summary ? 2 : 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronRightIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      {/* Reading progress indicator */}
      <div className="reading-progress mb-4">
        <div 
          className="reading-progress-bar" 
          style={{ 
            width: `${summary ? 100 : 100}%`,
            backgroundColor: themeColor 
          }} 
        />
      </div>
      
      {/* Book-like container with full height */}
      <div className="flex-1 overflow-hidden book-container" style={{ height: 'calc(100% - 100px)', maxHeight: 'calc(100% - 100px)' }}>
        <div 
          ref={bookContainerRef}
          className="h-full w-full"
        >
          {/* Content page - Full width */}
          <motion.div 
            className="w-full rounded-lg book-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ 
              height: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              boxShadow: `0 0 20px rgba(0, 0, 0, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.2), 0 0 10px ${themeColor}20`
            }}
          >
            <div className="book-page-content p-8 h-full overflow-y-auto custom-scrollbar">
              <div className="w-full mx-auto">
                <div className="chapter-heading text-center mb-8">
                  <div 
                    className="w-12 h-1 mx-auto mb-4" 
                    style={{ backgroundColor: themeColor }}
                  />
                  <h2 
                    className="text-lg uppercase tracking-wider font-light mb-2"
                    style={{ color: `${themeColor}` }}
                  >
                    {bookTitle || 'Summary'}
                  </h2>
                  <div 
                    className="w-12 h-1 mx-auto mt-4" 
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
                <div className="text-center">
                  <ReactMarkdown components={components}>
                    {summary}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
