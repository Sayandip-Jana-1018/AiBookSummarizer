import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

// This component updates CSS variables based on the current theme
export default function ThemeUpdater() {
  const { themeColor } = useTheme();
  
  useEffect(() => {
    // Update CSS variables when theme color changes
    document.documentElement.style.setProperty('--theme-color', themeColor);
    
    // Create a lighter version for the scrollbar thumb
    const r = parseInt(themeColor.slice(1, 3), 16);
    const g = parseInt(themeColor.slice(3, 5), 16);
    const b = parseInt(themeColor.slice(5, 7), 16);
    document.documentElement.style.setProperty(
      '--theme-color-light', 
      `rgba(${r}, ${g}, ${b}, 0.3)`
    );
  }, [themeColor]);
  
  // This component doesn't render anything
  return null;
}
