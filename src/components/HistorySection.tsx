import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  TrashIcon
} from '@heroicons/react/24/outline';

export interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  options: {
    length: 'short' | 'medium' | 'long';
    style: 'paragraph' | 'bullet';
    focus: 'general' | 'academic' | 'technical';
  };
  preview: string;
  summary?: string; // Full summary content
}

interface HistorySectionProps {
  history: HistoryItem[];
  onViewSummary: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function HistorySection({ history, onViewSummary, onDeleteItem }: HistorySectionProps) {
  const { themeColor } = useTheme();
  const [selectedBook, setSelectedBook] = useState<HistoryItem | null>(null);

  // Format date to a readable string
  const formatDate = (date: Date | string) => {
    // Ensure we have a valid date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid before formatting
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(dateObj);
  };

  // Get option label
  const getOptionLabel = (option: string, value: string) => {
    if (option === 'length') {
      return value === 'short' ? 'Short' : value === 'medium' ? 'Medium' : 'Long';
    } else if (option === 'style') {
      return value === 'paragraph' ? 'Paragraphs' : 'Bullet Points';
    } else {
      return value === 'general' ? 'General' : value === 'academic' ? 'Academic' : 'Technical';
    }
  };

  // Get option icon
  const getOptionIcon = (option: string, value: string) => {
    if (option === 'length') {
      return <DocumentTextIcon className="w-3 h-3" />;
    } else if (option === 'style') {
      return value === 'paragraph' ? 
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg> : 
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>;
    } else {
      return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <GlassCard className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <ClockIcon className="w-5 h-5 mr-2" />
          Recent Summaries
        </h2>
        <div className="flex items-center space-x-2">
          <div className="text-white/60 text-sm">
            {history.length} {history.length === 1 ? 'book' : 'books'} summarized
          </div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColor}20` }}>
            <BookOpenIcon className="w-8 h-8 text-white/70" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">No summaries yet</h3>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            Upload a book and generate a summary to see your history here.
          </p>
        </div>
      ) : (
        <motion.div 
          className="space-y-4 overflow-y-auto max-h-[calc(100vh-240px)] pr-2"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ scrollbarWidth: 'thin', scrollbarColor: `${themeColor}50 transparent` }}
        >
          {history.map((item) => (
            <motion.div 
              key={item.id} 
              className={`border rounded-lg p-4 transition-all duration-300 ${selectedBook?.id === item.id 
                ? `border-[${themeColor}] bg-white/5` 
                : 'border-white/10 hover:border-white/20'}`}
              variants={itemVariants}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1"
                    style={{ backgroundColor: `${themeColor}20` }}>
                    <BookOpenIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">{item.title}</h3>
                    <p className="text-white/60 text-xs mb-2 flex items-center">
                      <ClockIcon className="w-3 h-3 mr-1" />
                      {formatDate(item.date)}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.entries(item.options).map(([key, value]) => (
                        <div 
                          key={key} 
                          className="text-[10px] px-2 py-0.5 rounded-full flex items-center"
                          style={{ backgroundColor: `${themeColor}30` }}
                        >
                          {getOptionIcon(key, value)}
                          <span className="ml-1">{getOptionLabel(key, value)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/80 text-xs line-clamp-2">{item.preview}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200"
                    aria-label="Delete summary"
                  >
                    <TrashIcon className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex space-x-2">
                <button
                  onClick={() => onViewSummary(item)}
                  className="text-xs font-medium py-1.5 px-3 rounded-lg transition-all duration-200"
                  style={{ 
                    backgroundColor: `${themeColor}30`,
                    color: 'white'
                  }}
                >
                  View Summary
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </GlassCard>
  );
}
