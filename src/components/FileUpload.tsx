import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '../context/ThemeContext';
import { DocumentTextIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function FileUpload({ onFileSelect, selectedFile }: FileUploadProps) {
  const { themeColor } = useTheme();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    // Check file size (limit to 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit');
      return;
    }
    
    onFileSelect(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    onFileSelect(null as any);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`w-full border-2 border-dashed rounded-xl p-8 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer
            ${isDragActive ? 'border-white' : 'border-white/30 hover:border-white/50'}`}
          style={{ 
            borderColor: isDragActive ? themeColor : 'rgba(255, 255, 255, 0.3)',
            minHeight: '200px'
          }}
        >
          <input {...getInputProps()} />
          
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${themeColor}20` }}>
            <ArrowUpTrayIcon className="w-8 h-8 text-white" />
          </div>
          
          <p className="text-white font-medium text-lg mb-1">Drop your book here</p>
          <p className="text-white/60 text-sm mb-4 text-center">
            Upload a PDF file (max 20MB)
          </p>
          
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{ 
              backgroundColor: `${themeColor}50`,
              backdropFilter: 'blur(4px)'
            }}
          >
            Select File
          </button>
          
          {error && (
            <p className="mt-4 text-red-400 text-sm">{error}</p>
          )}
        </div>
      ) : (
        <div className="w-full rounded-xl p-6 transition-all duration-200 border border-white/10"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
              style={{ backgroundColor: `${themeColor}20` }}>
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{selectedFile.name}</p>
              <p className="text-white/60 text-xs">{formatFileSize(selectedFile.size)}</p>
            </div>
            
            <button 
              onClick={removeFile}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
