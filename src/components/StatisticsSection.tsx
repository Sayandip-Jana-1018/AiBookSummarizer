import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  AcademicCapIcon, 
  BeakerIcon,
  CalendarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { HistoryItem } from './HistorySection';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface StatisticsSectionProps {
  history: HistoryItem[];
}

export default function StatisticsSection({ history }: StatisticsSectionProps) {
  const { themeColor } = useTheme();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('all');
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>(history);
  const [showDemoData, setShowDemoData] = useState<boolean>(true); // Default to demo data for better visualization

  // Apply time range filter
  useEffect(() => {
    if (timeRange === 'all') {
      setFilteredHistory(history);
      return;
    }
    
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      cutoffDate.setFullYear(now.getFullYear() - 1);
    }
    
    setFilteredHistory(history.filter(item => new Date(item.date) >= cutoffDate));
  }, [timeRange, history]);

  // Generate random demo data for better visualization
  const generateRandomDemoData = () => {
    // Random values for summary lengths
    const demoSummariesByLength = {
      short: Math.floor(Math.random() * 15) + 5,
      medium: Math.floor(Math.random() * 20) + 10,
      long: Math.floor(Math.random() * 25) + 15,
    };
    
    // Random values for summary styles
    const demoSummariesByStyle = {
      paragraph: Math.floor(Math.random() * 30) + 15,
      bullet: Math.floor(Math.random() * 25) + 10,
    };
    
    // Random values for summary focus
    const demoSummariesByFocus = {
      general: Math.floor(Math.random() * 25) + 15,
      academic: Math.floor(Math.random() * 20) + 10,
      technical: Math.floor(Math.random() * 15) + 5,
    };

    // Random daily data for the past week
    const demoDailyData: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      demoDailyData[dateString] = Math.floor(Math.random() * 10) + 1;
    }

    return {
      demoSummariesByLength,
      demoSummariesByStyle,
      demoSummariesByFocus,
      demoDailyData,
      totalSummaries: Object.values(demoSummariesByLength).reduce((a, b) => a + b, 0)
    };
  };
  
  // Generate random demo data
  const {
    demoSummariesByLength,
    demoSummariesByStyle,
    demoSummariesByFocus,
    demoDailyData,
    totalSummaries: demoTotalSummaries
  } = generateRandomDemoData();
  
  // Calculate statistics from real data
  const realTotalSummaries = filteredHistory.length;
  const realSummariesByLength = {
    short: filteredHistory.filter(item => item.options.length === 'short').length,
    medium: filteredHistory.filter(item => item.options.length === 'medium').length,
    long: filteredHistory.filter(item => item.options.length === 'long').length,
  };
  
  const realSummariesByStyle = {
    paragraph: filteredHistory.filter(item => item.options.style === 'paragraph').length,
    bullet: filteredHistory.filter(item => item.options.style === 'bullet').length,
  };
  
  const realSummariesByFocus = {
    general: filteredHistory.filter(item => item.options.focus === 'general').length,
    academic: filteredHistory.filter(item => item.options.focus === 'academic').length,
    technical: filteredHistory.filter(item => item.options.focus === 'technical').length,
  };

  // Use either real data or demo data based on toggle
  const totalSummaries = showDemoData ? demoTotalSummaries : realTotalSummaries;
  const summariesByLength = showDemoData ? demoSummariesByLength : realSummariesByLength;
  const summariesByStyle = showDemoData ? demoSummariesByStyle : realSummariesByStyle;
  const summariesByFocus = showDemoData ? demoSummariesByFocus : realSummariesByFocus;

  // Get the max value for scaling the bars
  const maxLengthValue = Math.max(...Object.values(summariesByLength), 1);
  const maxStyleValue = Math.max(...Object.values(summariesByStyle), 1);
  const maxFocusValue = Math.max(...Object.values(summariesByFocus), 1);
  
  // Generate dates for timeline chart
  const getTimelineData = () => {
    if (showDemoData) {
      // Sort demo data by date
      const sortedDates = Object.keys(demoDailyData).sort();
      return {
        labels: sortedDates.map(date => {
          const d = new Date(date);
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        values: sortedDates.map(date => demoDailyData[date])
      };
    }
    
    // Group by date
    const groupedByDate: Record<string, number> = {};
    
    // Get date range based on timeRange
    const now = new Date();
    const dates: string[] = [];
    
    if (timeRange === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (timeRange === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
    } else if (timeRange === 'year') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        dates.push(`${year}-${month.toString().padStart(2, '0')}`);
      }
    }
    
    // Initialize all dates with 0
    dates.forEach(date => {
      groupedByDate[date] = 0;
    });
    
    // Count summaries by date
    filteredHistory.forEach(item => {
      const itemDate = new Date(item.date);
      let dateKey;
      
      if (timeRange === 'year') {
        dateKey = `${itemDate.getFullYear()}-${(itemDate.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        dateKey = itemDate.toISOString().split('T')[0];
      }
      
      if (groupedByDate[dateKey] !== undefined) {
        groupedByDate[dateKey]++;
      }
    });
    
    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort();
    
    return {
      labels: sortedDates.map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      values: sortedDates.map(date => groupedByDate[date])
    };
  };
  
  const timelineData = getTimelineData();

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

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: 'Inter, sans-serif',
            size: 11
          },
          boxWidth: 15,
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: themeColor,
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxRotation: 0,
          autoSkip: true,
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10
          }
        },
        beginAtZero: true
      }
    }
  };

  // Chart.js options and configurations
  const getLineChartConfig = () => {
    // Create gradient
    const gradient = (context: any) => {
      const chart = context.chart;
      const {ctx, chartArea} = chart;
      if (!chartArea) return null;
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, `${themeColor}10`);
      gradient.addColorStop(1, `${themeColor}80`);
      return gradient;
    };

    return {
      labels: timelineData.labels,
      datasets: [
        {
          label: 'Summaries',
          data: timelineData.values,
          borderColor: themeColor,
          backgroundColor: gradient,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: themeColor,
          pointBorderColor: 'rgba(0, 0, 0, 0)',
          pointBorderWidth: 0,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
        },
      ],
    };
  };
  
  const getBarChartConfig = () => {
    return {
      labels: Object.keys(summariesByLength).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          label: 'Summaries by Length',
          data: Object.values(summariesByLength),
          backgroundColor: [
            `${themeColor}80`,
            `${themeColor}A0`,
            `${themeColor}C0`,
          ],
          borderWidth: 0,
          borderRadius: 6,
        },
      ],
    };
  };
  
  const getPieChartConfig = () => {
    return {
      labels: Object.keys(summariesByStyle).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          data: Object.values(summariesByStyle),
          backgroundColor: [
            `${themeColor}90`,
            `${themeColor}60`,
          ],
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  };
  
  const getDoughnutChartConfig = () => {
    return {
      labels: Object.keys(summariesByFocus).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          data: Object.values(summariesByFocus),
          backgroundColor: [
            `${themeColor}70`,
            `${themeColor}A0`,
            `${themeColor}50`,
          ],
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  };
  
  // Chart card component
  const ChartCard = ({ 
    title, 
    icon,
    children,
    className = ''
  }: { 
    title: string,
    icon: React.ReactNode,
    children: React.ReactNode,
    className?: string
  }) => {
    return (
      <GlassCard className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-md flex items-center justify-center mr-2"
              style={{ backgroundColor: `${themeColor}20` }}>
              {icon}
            </div>
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        </div>
        <div className="chart-container flex-1">
          {children}
        </div>
      </GlassCard>
    );
  };
  
  // Stats card component
  const StatCard = ({ 
    title, 
    value,
    icon,
    trend,
    trendLabel
  }: { 
    title: string,
    value: number | string,
    icon: React.ReactNode,
    trend?: number,
    trendLabel?: string
  }) => {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
            style={{ backgroundColor: `${themeColor}20` }}>
            {icon}
          </div>
          <div>
            <h3 className="text-white/60 text-sm mb-1">{title}</h3>
            <p className="text-white text-xl font-semibold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center mt-1">
                <span className={`text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                  <ArrowTrendingUpIcon className={`w-3 h-3 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
                  {Math.abs(trend)}% {trendLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    );
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
        
        <div className="flex space-x-4">
          {/* Data toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-white/60 text-sm">Data:</span>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${!showDemoData ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              onClick={() => setShowDemoData(false)}
            >
              Real
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${showDemoData ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              onClick={() => setShowDemoData(true)}
            >
              Demo
            </button>
          </div>
          
          {/* Time range selector */}
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'week' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'month' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'year' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeRange === 'all' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              onClick={() => setTimeRange('all')}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 && !showDemoData ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColor}20` }}>
            <ChartBarIcon className="w-8 h-8 text-white/70" />
          </div>
          <h3 className="text-white font-medium text-lg mb-2">No Statistics Yet</h3>
          <p className="text-white/60 text-sm text-center max-w-md">
            Start summarizing books to see statistics about your summaries, or click the "Demo" button to see sample data.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div variants={itemVariants}>
              <StatCard 
                title="Total Summaries" 
                value={totalSummaries}
                icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <StatCard 
                title="Most Popular Length" 
                value={Object.entries(summariesByLength).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].charAt(0).toUpperCase() + Object.entries(summariesByLength).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].slice(1)}
                icon={<ClockIcon className="w-5 h-5 text-white" />}
                trend={20}
                trendLabel="from last period"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <StatCard 
                title="Most Popular Style" 
                value={Object.entries(summariesByStyle).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].charAt(0).toUpperCase() + Object.entries(summariesByStyle).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].slice(1)}
                icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <StatCard 
                title="Most Popular Focus" 
                value={Object.entries(summariesByFocus).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].charAt(0).toUpperCase() + Object.entries(summariesByFocus).reduce((a, b) => a[1] > b[1] ? a : b, ['', 0])[0].slice(1)}
                icon={<BeakerIcon className="w-5 h-5 text-white" />}
                trend={-5}
                trendLabel="from last period"
              />
            </motion.div>
          </div>
          
          {/* Charts - Grid layout with equal height and width for all charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <ChartCard 
                title="Activity Timeline" 
                icon={<CalendarIcon className="w-4 h-4 text-white" />}
              >
                <div className="h-64">
                  <Line data={getLineChartConfig()} options={chartOptions} />
                </div>
              </ChartCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ChartCard 
                title="Summary Style Distribution" 
                icon={<ChartPieIcon className="w-4 h-4 text-white" />}
              >
                <div className="h-64 flex items-center justify-center">
                  <Pie data={getPieChartConfig()} options={chartOptions} />
                </div>
              </ChartCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ChartCard 
                title="Summary Length Distribution" 
                icon={<ChartBarIcon className="w-4 h-4 text-white" />}
              >
                <div className="h-64">
                  <Bar data={getBarChartConfig()} options={chartOptions} />
                </div>
              </ChartCard>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ChartCard 
                title="Summary Focus Distribution" 
                icon={<BeakerIcon className="w-4 h-4 text-white" />}
              >
                <div className="h-64 flex items-center justify-center">
                  <Doughnut data={getDoughnutChartConfig()} options={chartOptions} />
                </div>
              </ChartCard>
            </motion.div>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}