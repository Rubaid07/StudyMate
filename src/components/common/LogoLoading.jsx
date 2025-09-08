import { useEffect, useState } from 'react';

const LogoLoading = ({ size = 'medium', text = "Loading..." }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };

  return (
    <div className="logo-loading flex flex-col items-center justify-center min-h-screen">
      <div className={`relative ${sizeClasses[size]} mb-6`}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-ping opacity-75"></div>
        <div className="relative flex items-center justify-center w-full h-full bg-white rounded-full shadow-lg border-4 border-indigo-100">
          <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <p className="font-bold text-white text-xl">S</p>
          </div>
        </div>
        <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 border-r-purple-600 rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className={`font-semibold text-gray-700 ${textSizes[size]} mb-2`}>
          {text}
        </p>
        <p className="text-gray-500 text-sm">
          StudyMate{dots}
        </p>
      </div>
      <div className="w-48 bg-gray-200 rounded-full h-2 mt-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 animate-progress"
          style={{ width: '85%' }}
        ></div>
      </div>
    </div>
  );
};

export default LogoLoading;