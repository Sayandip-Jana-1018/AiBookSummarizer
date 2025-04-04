import React, { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
  style?: React.CSSProperties;
}

export default function GlassCard({ 
  children, 
  className = '', 
  glowIntensity = 'medium',
  noPadding = false,
  style = {}
}: GlassCardProps) {
  const { themeColor } = useTheme();
  
  // Convert hex to rgba for the glow effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  // Different glow intensities
  const glowStyles = {
    low: {
      boxShadow: `0 0 15px ${hexToRgba(themeColor, 0.2)}`
    },
    medium: {
      boxShadow: `0 0 25px ${hexToRgba(themeColor, 0.3)}`
    },
    high: {
      boxShadow: `0 0 35px ${hexToRgba(themeColor, 0.4)}`
    }
  };

  return (
    <div 
      className={`rounded-2xl backdrop-blur-xl border border-white/10 ${noPadding ? '' : 'p-6'} ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.2)',
        ...glowStyles[glowIntensity],
        ...style
      }}
    >
      {children}
    </div>
  );
}
