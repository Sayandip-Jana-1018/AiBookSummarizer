import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeSelector from '../components/ThemeSelector';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import FileUpload from '../components/FileUpload';
import SummaryOptions, { SummaryOptionsType } from '../components/SummaryOptions';
import SummaryDisplay from '../components/SummaryDisplay';
import HistorySection, { HistoryItem } from '../components/HistorySection';
import StatisticsSection from '../components/StatisticsSection';
import ThemeUpdater from '../components/ThemeUpdater';
import VirtualCoach from '../components/ui/VirtualCoach';
import BookChat from '../components/BookChat';
import { mockSummarizeText, extractTextFromPDF, summarizeText } from '../utils/gemini';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon, 
  SparklesIcon, 
  DocumentTextIcon, 
  BookmarkIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const { themeColor } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookTitle, setBookTitle] = useState<string | undefined>(undefined);
  const [options, setOptions] = useState<SummaryOptionsType>({
    length: 'medium',
    style: 'paragraph',
    focus: 'general'
  });
  
  // History management
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    // Try to load history from localStorage
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('bookSummaryHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });
  
  // Stats
  const [summaryCount, setSummaryCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'summarize' | 'history' | 'stats' | 'chat'>('summarize');
  const [selectedChatBook, setSelectedChatBook] = useState<HistoryItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Function to select a book for chat
  const handleSelectChatBook = (book: HistoryItem | null) => {
    setSelectedChatBook(book);
  };
  
  // Animation states
  const [pageLoaded, setPageLoaded] = useState(false);

  const darkenColor = (color: string, amount: number) => {
    if (color.startsWith('#')) {
      const r = Math.max(0, parseInt(color.slice(1, 3), 16) - amount);
      const g = Math.max(0, parseInt(color.slice(3, 5), 16) - amount);
      const b = Math.max(0, parseInt(color.slice(5, 7), 16) - amount);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return color;
  };

  // Handle file selection
  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file);
    setSummary(null);
    
    if (file) {
      setBookTitle(file.name.replace(/\.[^/.]+$/, ""));
      try {
        const text = await extractTextFromPDF(file);
        setExtractedText(text);
      } catch (error) {
        console.error("Error extracting text:", error);
        setExtractedText("Error extracting text from the PDF. Please try another file.");
      }
    } else {
      setExtractedText(null);
      setBookTitle(undefined);
    }
  };

  // Generate summary when button is clicked
  const generateSummary = async () => {
    if (!extractedText) return;
    
    setIsGenerating(true);
    try {
      // Using real Gemini API with the provided key
      const result = await summarizeText(extractedText, options);
      setSummary(result);
      
      // Add to history
      addToHistory(result);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("An error occurred while generating the summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setSelectedFile(null);
    setExtractedText(null);
    setSummary(null);
    setBookTitle(undefined);
  };
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Page load animation
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  
  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bookSummaryHistory', JSON.stringify(history));
    }
  }, [history]);
  
  // Add summary to history
  const addToHistory = (newSummary: string) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      title: bookTitle || 'Untitled Book',
      date: new Date(),
      options,
      preview: newSummary.substring(0, 150) + '...'
    };
    
    setHistory(prev => [historyItem, ...prev]);
    setSummaryCount(prev => prev + 1);
  };
  
  // View summary from history
  const viewHistorySummary = (item: HistoryItem) => {
    setBookTitle(item.title);
    setOptions(item.options);
    setSummary(item.preview.slice(0, -3)); // Remove the '...' from preview
    setActiveTab('summarize');
  };
  
  // Delete history item
  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Create ambient light effects
  const ambientLights = [
    { top: '10%', left: '15%', width: '30rem', height: '30rem' },
    { top: '60%', right: '5%', width: '25rem', height: '25rem' },
    { bottom: '10%', left: '10%', width: '20rem', height: '20rem' },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg,
            ${darkenColor(themeColor, 60)} 0%,
            ${darkenColor(themeColor, 80)} 10%,
            ${darkenColor(themeColor, 100)} 20%,
            rgba(0, 0, 0, 1) 40%,
            rgba(0, 0, 0, 1) 60%,
            ${darkenColor(themeColor, 100)} 80%,
            ${darkenColor(themeColor, 80)} 90%,
            ${darkenColor(themeColor, 60)} 100%
          )
        `
      }}
    >
      {/* Ambient lights */}
      {ambientLights.map((light, index) => (
        <div
          key={index}
          className="ambient-light"
          style={{
            ...light,
            backgroundColor: themeColor,
          }}
        />
      ))}

      <ThemeSelector />
      <ThemeUpdater />
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-4 relative z-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text" 
          style={{ backgroundImage: `linear-gradient(135deg, ${themeColor} 0%, white 100%)` }}>
          AI-Powered Book Summarizer
        </h1>
        <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
          Transform lengthy books into concise, insightful summaries with the power of Gemini AI
        </p>
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-3 sm:space-y-0 mb-8 sm:mb-12">
          <div className="flex items-center justify-center text-white/70 text-sm">
            <SparklesIcon className="w-5 h-5 mr-2" />
            <span>Intelligent Analysis</span>
          </div>
          <div className="flex items-center justify-center text-white/70 text-sm">
            <BookmarkIcon className="w-5 h-5 mr-2" />
            <span>Customizable Summaries</span>
          </div>
          <div className="flex items-center justify-center text-white/70 text-sm">
            <AcademicCapIcon className="w-5 h-5 mr-2" />
            <span>Academic Focus</span>
          </div>
        </div>
      </section>

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-white/10 z-50 px-2 py-1 safe-bottom">
          <div className="flex justify-around">
            <button 
              onClick={() => setActiveTab('summarize')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'summarize' ? 'bg-white/10' : ''}`}
            >
              <DocumentTextIcon className="w-5 h-5 text-white" />
              <span className="text-xs text-white/80 mt-1">Summarize</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'history' ? 'bg-white/10' : ''}`}
            >
              <ClockIcon className="w-5 h-5 text-white" />
              <span className="text-xs text-white/80 mt-1">History</span>
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'stats' ? 'bg-white/10' : ''}`}
            >
              <ChartBarIcon className="w-5 h-5 text-white" />
              <span className="text-xs text-white/80 mt-1">Stats</span>
            </button>
            <button 
              onClick={() => {
                if (history.length > 0) {
                  setActiveTab('chat');
                  if (!selectedChatBook) {
                    setSelectedChatBook(history[0]);
                  }
                }
              }}
              className={`flex flex-col items-center py-2 px-3 rounded-lg ${activeTab === 'chat' ? 'bg-white/10' : ''}`}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              <span className="text-xs text-white/80 mt-1">Chat</span>
            </button>
          </div>
        </div>
      )}
      
      <motion.main 
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-28 sm:pb-24 md:pb-16 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={pageLoaded ? "visible" : "hidden"}
      >
        {/* Desktop Tabs - Only show on non-mobile */}
        {!isMobile && (
          <div className="mb-8 flex justify-center">
            <div className="inline-flex bg-black/30 backdrop-blur-md rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setActiveTab('summarize')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'summarize' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Summarize
                </span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  History
                </span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'stats' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center">
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  Stats
                </span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}
              >
                <span className="flex items-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Chat
                </span>
              </button>
            </div>
          </div>
        )}
        
        {/* Main Content based on active tab */}
        <motion.div variants={itemVariants} className="mb-16">
          {activeTab === 'summarize' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Left column - File upload and options */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                <FileUpload 
                  onFileSelect={handleFileSelect} 
                  selectedFile={selectedFile} 
                />
                
                <SummaryOptions 
                  options={options} 
                  onChange={setOptions} 
                />
                
                <GlassCard className="p-3 sm:p-4">
                  <button
                    onClick={generateSummary}
                    disabled={!extractedText || isGenerating}
                    className="w-full py-2 sm:py-3 rounded-lg font-medium text-white transition-all duration-300 relative overflow-hidden text-sm sm:text-base"
                    style={{
                      backgroundColor: !extractedText || isGenerating ? '#555' : themeColor,
                      opacity: !extractedText || isGenerating ? 0.7 : 1
                    }}
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Summary...
                      </span>
                    ) : 'Generate Summary'}
                  </button>
                  
                  {summary && (
                    <button
                      onClick={handleReset}
                      className="mt-3 w-full py-2 rounded-lg font-medium text-white/70 bg-white/10 hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                    >
                      Reset & Start Over
                    </button>
                  )}
                </GlassCard>
              </div>
              
              {/* Right column - Summary display */}
              <div className="lg:col-span-2 mt-4 sm:mt-0">
                <div style={{ height: '100%' }}>
                  <SummaryDisplay 
                    summary={summary} 
                    isLoading={isGenerating} 
                    bookTitle={bookTitle}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <HistorySection 
              history={history}
              onViewSummary={viewHistorySummary}
              onDeleteItem={deleteHistoryItem}
            />
          )}
          
          {activeTab === 'stats' && (
            <StatisticsSection history={history} />
          )}
          
          {activeTab === 'chat' && (
            <div className="h-[450px] sm:h-[500px] md:h-[600px] pb-4 sm:pb-0">
              {history.length > 0 ? (
                <BookChat 
                  selectedBook={selectedChatBook} 
                  onSelectBook={handleSelectChatBook} 
                  history={history} 
                />
              ) : (
                <GlassCard className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4"
                    style={{ backgroundColor: `${themeColor}20` }}>
                    <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white/70" />
                  </div>
                  <h3 className="text-white font-medium text-base sm:text-lg mb-2">No Books to Chat With</h3>
                  <p className="text-white/60 text-xs sm:text-sm text-center max-w-md mb-4 sm:mb-6">
                    You need to summarize books first to use the chat feature. 
                    Upload a book and generate a summary to get started.
                  </p>
                  <button
                    onClick={() => setActiveTab('summarize')}
                    className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
                    style={{ backgroundColor: `${themeColor}40`, color: 'white' }}
                  >
                    Go to Summarize
                  </button>
                </GlassCard>
              )}
            </div>
          )}
        </motion.div>
        
        {/* Virtual Coach Section */}
        <section className="mt-12 sm:mt-16 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">Your AI Reading Assistant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <GlassCard className="glass-hover p-4 sm:p-5">
                <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">Meet Your Virtual Reading Coach</h3>
                <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4">
                  Our AI assistant is powered by Google's Gemini 2.5 Pro, capable of understanding and summarizing even the most complex books.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {[
                    "Processes books up to 20MB in size",
                    "Handles large texts with intelligent chunking",
                    "Provides customized summaries based on your preferences",
                    "Maintains key concepts and important details"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5"
                        style={{ backgroundColor: `${themeColor}30` }}>
                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/70 text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-white/60 text-xs sm:text-sm p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="flex items-start">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Gemini 2.0 Flash can effectively handle large books by breaking them into manageable chunks, summarizing each part, and then creating a cohesive final summary.
                    </span>
                  </p>
                </div>
              </GlassCard>
            </div>
            <div className="h-[250px] sm:h-[300px] md:h-[400px]">
              <VirtualCoach 
                modelUrl="/virtual_coach.glb" 
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="mt-12 sm:mt-16 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 stagger-children">
            {[
              {
                icon: <BookOpenIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                title: "1. Upload Your Book",
                description: "Upload any PDF book up to 20MB in size. Our system will extract the text content."
              },
              {
                icon: <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                title: "2. Customize Options",
                description: "Select your preferred summary length, style, and focus to tailor the output to your needs."
              },
              {
                icon: <DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
                title: "3. Get Your Summary",
                description: "Receive a beautifully formatted summary with key insights and main points from the book."
              }
            ].map((step, index) => (
              <GlassCard key={index} className="glass-hover text-center p-4 sm:p-6 md:p-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mx-auto flex items-center justify-center mb-3 sm:mb-4"
                  style={{ backgroundColor: `${themeColor}20` }}>
                  {step.icon}
                </div>
                <h3 className="text-white text-base sm:text-lg font-semibold mb-1 sm:mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm sm:text-base">{step.description}</p>
              </GlassCard>
            ))}
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 stagger-children">
            {[
              {
                question: "What file types are supported?",
                answer: "Currently, we support PDF files up to 20MB in size. We plan to add support for more file types in the future."
              },
              {
                question: "How does the AI handle large books?",
                answer: "Our system uses an intelligent chunking approach to process large books. It breaks the text into manageable sections, summarizes each section, and then creates a cohesive summary of the entire book."
              },
              {
                question: "What is the difference between focus options?",
                answer: "General focus provides a broad overview suitable for most readers. Academic focus emphasizes scholarly concepts and methodologies. Technical focus highlights technical details and implementations."
              },
              {
                question: "Is my data secure?",
                answer: "Yes, we don't store the content of your books on our servers. All processing is done in memory and summaries are generated on-demand."
              }
            ].map((faq, index) => (
              <GlassCard key={index} className="glass-hover p-4 sm:p-5">
                <h3 className="text-white text-base sm:text-lg font-semibold mb-1 sm:mb-2">{faq.question}</h3>
                <p className="text-white/70 text-sm sm:text-base">{faq.answer}</p>
              </GlassCard>
            ))}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="text-center text-white/50 text-xs sm:text-sm py-6 sm:py-8 border-t border-white/10 mt-8 mb-16 sm:mb-0">
          <p>© {new Date().getFullYear()} BookSummarizer. Powered by Gemini AI.</p>
        </footer>
      </motion.main>
    </div>
  );
}