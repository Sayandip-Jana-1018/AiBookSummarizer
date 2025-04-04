import React from 'react';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';
import { 
  DocumentTextIcon, 
  DocumentMagnifyingGlassIcon, 
  AcademicCapIcon,
  BeakerIcon,
  ListBulletIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

export type SummaryOptionsType = {
  length: 'short' | 'medium' | 'long';
  style: 'paragraph' | 'bullet';
  focus: 'general' | 'academic' | 'technical';
};

interface SummaryOptionsProps {
  options: SummaryOptionsType;
  onChange: (options: SummaryOptionsType) => void;
}

export default function SummaryOptions({ options, onChange }: SummaryOptionsProps) {
  const { themeColor } = useTheme();

  const updateOptions = (key: keyof SummaryOptionsType, value: any) => {
    onChange({ ...options, [key]: value });
  };

  const OptionButton = ({ 
    active, 
    onClick, 
    icon, 
    label, 
    description 
  }: { 
    active: boolean; 
    onClick: () => void; 
    icon: React.ReactNode; 
    label: string;
    description: string;
  }) => (
    <button
      onClick={onClick}
      className={`relative w-full rounded-xl p-4 transition-all duration-200 text-left group ${
        active ? 'ring-2' : 'hover:bg-white/5'
      }`}
      style={{ 
        backgroundColor: active ? `${themeColor}15` : 'transparent'
      }}
    >
      {active && (
        <div 
          className="absolute inset-0 rounded-xl animate-pulse opacity-20"
          style={{ backgroundColor: themeColor }}
        />
      )}
      <div className="flex items-center">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
          style={{ backgroundColor: `${themeColor}20` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{label}</p>
          <p className="text-white/60 text-xs">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <GlassCard className="w-full">
      <h2 className="text-white text-lg font-semibold mb-6">Summary Options</h2>
      
      <div className="space-y-6">
        {/* Length Options */}
        <div>
          <h3 className="text-white/80 text-sm font-medium mb-3">Summary Length</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <OptionButton
              active={options.length === 'short'}
              onClick={() => updateOptions('length', 'short')}
              icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
              label="Short"
              description="Concise overview (4-5 paragraphs)"
            />
            <OptionButton
              active={options.length === 'medium'}
              onClick={() => updateOptions('length', 'medium')}
              icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
              label="Medium"
              description="Balanced detail (6-7 paragraphs)"
            />
            <OptionButton
              active={options.length === 'long'}
              onClick={() => updateOptions('length', 'long')}
              icon={<DocumentTextIcon className="w-5 h-5 text-white" />}
              label="Long"
              description="Comprehensive (8-10 paragraphs)"
            />
          </div>
        </div>
        
        {/* Style Options */}
        <div>
          <h3 className="text-white/80 text-sm font-medium mb-3">Summary Style</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <OptionButton
              active={options.style === 'paragraph'}
              onClick={() => updateOptions('style', 'paragraph')}
              icon={<DocumentIcon className="w-5 h-5 text-white" />}
              label="Paragraphs"
              description="Flowing narrative structure"
            />
            <OptionButton
              active={options.style === 'bullet'}
              onClick={() => updateOptions('style', 'bullet')}
              icon={<ListBulletIcon className="w-5 h-5 text-white" />}
              label="Bullet Points"
              description="Organized list format"
            />
          </div>
        </div>
        
        {/* Focus Options */}
        <div>
          <h3 className="text-white/80 text-sm font-medium mb-3">Summary Focus</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <OptionButton
              active={options.focus === 'general'}
              onClick={() => updateOptions('focus', 'general')}
              icon={<DocumentMagnifyingGlassIcon className="w-5 h-5 text-white" />}
              label="General"
              description="Broad overview for all readers"
            />
            <OptionButton
              active={options.focus === 'academic'}
              onClick={() => updateOptions('focus', 'academic')}
              icon={<AcademicCapIcon className="w-5 h-5 text-white" />}
              label="Academic"
              description="Focus on scholarly concepts"
            />
            <OptionButton
              active={options.focus === 'technical'}
              onClick={() => updateOptions('focus', 'technical')}
              icon={<BeakerIcon className="w-5 h-5 text-white" />}
              label="Technical"
              description="Emphasis on technical details"
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
