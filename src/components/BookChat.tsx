import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ArrowPathIcon,
  BookOpenIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { HistoryItem } from './HistorySection';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = "AIzaSyCQfaAAO8Tg94plWAytQdyHW0lpoxhFrFo";
const genAI = new GoogleGenerativeAI(API_KEY);

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface BookChatProps {
  selectedBook: HistoryItem | null;
  onSelectBook: (book: HistoryItem | null) => void;
  history: HistoryItem[];
}

export default function BookChat({ selectedBook, onSelectBook, history }: BookChatProps) {
  const { themeColor } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedBook]);

  // Reset messages when selected book changes
  useEffect(() => {
    if (selectedBook) {
      setMessages([
        {
          id: '0',
          content: `I'm your AI assistant for "${selectedBook.title}". Ask me any questions about this book based on its summary! I'll answer based solely on the content that's been summarized.`,
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedBook]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || !selectedBook) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Generate AI response using Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Create prompt with context about the book
      const prompt = `
        You are an AI assistant helping with questions about the book "${selectedBook.title}".
        
        Here's what we know about the book from its summary:
        ${selectedBook.summary || selectedBook.preview}
        
        The summary was generated with these options:
        - Length: ${selectedBook.options.length}
        - Style: ${selectedBook.options.style}
        - Focus: ${selectedBook.options.focus}
        
        Please answer the following question about this book in a helpful, conversational way.
        Base your answer ONLY on the content of the book summary provided above.
        If you don't know the answer based on the available information, be honest about it and don't make up information.
        
        User question: ${inputValue}
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponseText = response.text();
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while generating a response. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input submission
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <GlassCard className="h-full flex flex-col p-2 sm:p-4">
      {/* Book selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-white/10 gap-2">
        <div className="flex items-center">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0"
            style={{ backgroundColor: `${themeColor}30` }}>
            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 overflow-hidden">
            <h2 className="text-white font-semibold text-sm sm:text-lg truncate">
              {selectedBook ? `Chat with ${selectedBook.title}` : 'Book Chat'}
            </h2>
            <p className="text-white/60 text-xs sm:text-sm truncate">
              {selectedBook ? 'Ask questions about this book' : 'Select a book to chat with'}
            </p>
          </div>
        </div>
        
        {selectedBook && (
          <select
            value={selectedBook.id}
            onChange={(e) => {
              const bookId = e.target.value;
              const book = history.find(b => b.id === bookId) || null;
              onSelectBook(book);
            }}
            className="bg-black/30 text-white text-xs sm:text-sm rounded-lg border border-white/10 px-2 sm:px-3 py-1 sm:py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-white/30 pr-6 sm:pr-8 w-full sm:w-auto"
          >
            {history.map(book => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
        )}
      </div>
      
      {selectedBook ? (
        <>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 pr-1 sm:pr-2">
            <motion.div 
              className="space-y-2 sm:space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {messages.map((message) => (
                <motion.div 
                  key={message.id}
                  variants={itemVariants}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-3 max-w-[90%] sm:max-w-[80%] ${message.sender === 'user' 
                      ? 'bg-gradient-to-r from-[#5B21B650] to-[#5B21B630] rounded-tr-none' 
                      : 'bg-gradient-to-r from-[#5B21B630] to-[#5B21B610] rounded-tl-none'}`}
                  >
                    <div className="flex items-center mb-1">
                      <div 
                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-1 sm:mr-2 flex-shrink-0"
                        style={{ backgroundColor: `${themeColor}30` }}
                      >
                        {message.sender === 'user' ? (
                          <UserIcon className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                        ) : (
                          <SparklesIcon className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                        )}
                      </div>
                      <span className="text-white/60 text-[9px] sm:text-xs truncate">
                        {message.sender === 'user' ? 'You' : 'AI Assistant'} • {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-white text-[11px] sm:text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  variants={itemVariants}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-[#5B21B630] to-[#5B21B610] rounded-2xl px-2.5 sm:px-4 py-1.5 sm:py-3">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-1 sm:mr-2 flex-shrink-0"
                        style={{ backgroundColor: `${themeColor}30` }}
                      >
                        <ArrowPathIcon className="w-2 h-2 sm:w-3 sm:h-3 text-white animate-spin" />
                      </div>
                      <span className="text-white/60 text-[9px] sm:text-xs">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          </div>
          
          {/* Input area */}
          <div className="relative mt-auto">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about this book..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-3 pr-8 sm:pr-12 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || inputValue.trim() === ''}
              className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ 
                backgroundColor: inputValue.trim() === '' ? 'rgba(255, 255, 255, 0.1)' : `${themeColor}50`,
                opacity: isLoading ? 0.5 : 1
              }}
            >
              <PaperAirplaneIcon className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4"
            style={{ backgroundColor: `${themeColor}20` }}>
            <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white/70" />
          </div>
          <h3 className="text-white font-medium text-base sm:text-lg mb-2">Select a Book to Chat</h3>
          <p className="text-white/60 text-xs sm:text-sm text-center max-w-md mb-4 sm:mb-6">
            Choose a book from your history to start asking questions about it.
          </p>
          
          {history.length === 0 ? (
            <p className="text-white/40 text-xs sm:text-sm">
              You need to summarize books first to use this feature.
            </p>
          ) : (
            <select
              onChange={(e) => {
                const bookId = e.target.value;
                const book = history.find(b => b.id === bookId) || null;
                onSelectBook(book);
              }}
              className="bg-black/30 text-white text-xs sm:text-sm rounded-lg border border-white/10 px-3 sm:px-4 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-white/30 pr-6 sm:pr-8"
            >
              <option value="" disabled selected>Select a book</option>
              {history.map(book => (
                <option key={book.id} value={book.id}>{book.title}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </GlassCard>
  );
}
