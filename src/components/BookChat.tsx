import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ArrowPathIcon,
  BookOpenIcon
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
    <GlassCard className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
            style={{ backgroundColor: `${themeColor}20` }}>
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Book Chat</h2>
            <p className="text-white/60 text-xs">Ask questions about your summarized books</p>
          </div>
        </div>
        
        {/* Book selector dropdown */}
        <div className="relative">
          <select
            value={selectedBook?.id || ''}
            onChange={(e) => {
              const bookId = e.target.value;
              const book = history.find(b => b.id === bookId) || null;
              onSelectBook(book);
            }}
            className="text-white text-sm rounded-lg border px-3 py-2 appearance-none focus:outline-none focus:ring-1 pr-8"
            style={{
              backgroundColor: `${themeColor}20`,
              borderColor: `${themeColor}50`,
              boxShadow: `0 0 10px ${themeColor}30`
            }}
          >
            <option 
              value="" 
              disabled 
              style={{
                backgroundColor: `${themeColor}30`,
                color: 'black'
              }}
            >
              Select a book
            </option>
            {history.map(book => (
              <option 
                key={book.id} 
                value={book.id}
                style={{
                  backgroundColor: `${themeColor}30`,
                  color: 'black'
                }}
              >
                {book.title}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {selectedBook ? (
        <>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={itemVariants}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-white/10 to-white/5 ml-auto' 
                        : `bg-gradient-to-r from-[${themeColor}30] to-[${themeColor}10]`
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                        style={{ 
                          backgroundColor: message.sender === 'user' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : `${themeColor}30`
                        }}
                      >
                        {message.sender === 'user' ? (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        ) : (
                          <SparklesIcon className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-white/60 text-xs">
                        {message.sender === 'user' ? 'You' : 'AI Assistant'} • {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-white text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  variants={itemVariants}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-[#5B21B630] to-[#5B21B610] rounded-2xl px-4 py-3">
                    <div className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: `${themeColor}30` }}
                      >
                        <ArrowPathIcon className="w-3 h-3 text-white animate-spin" />
                      </div>
                      <span className="text-white/60 text-xs">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
          </div>
          
          {/* Input area */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about this book..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || inputValue.trim() === ''}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ 
                backgroundColor: inputValue.trim() === '' ? 'rgba(255, 255, 255, 0.1)' : `${themeColor}50`,
                opacity: isLoading ? 0.5 : 1
              }}
            >
              <PaperAirplaneIcon className="w-4 h-4 text-white" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColor}20` }}>
            <BookOpenIcon className="w-8 h-8 text-white/70" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">Select a Book to Chat</h3>
          <p className="text-white/60 text-sm text-center max-w-md mb-6">
            Choose a book from your history to start asking questions about it.
          </p>
          
          {history.length === 0 ? (
            <p className="text-white/40 text-sm">
              You need to summarize books first to use this feature.
            </p>
          ) : (
            <select
              onChange={(e) => {
                const bookId = e.target.value;
                const book = history.find(b => b.id === bookId) || null;
                onSelectBook(book);
              }}
              className="bg-black/30 text-white text-sm rounded-lg border border-white/10 px-4 py-2 appearance-none focus:outline-none focus:ring-1 focus:ring-white/30 pr-8"
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
