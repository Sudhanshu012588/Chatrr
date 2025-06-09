import React from 'react';

function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Loading Spinner */}
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-4 border-blue-500 border-opacity-25 animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-4 border-blue-600 border-opacity-75 animate-spin-reverse"></div>
        </div>

        {/* Loading Text */}
        <p className="text-xl md:text-2xl font-semibold text-gray-700">
          Loading ChatApp...
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-8">
          Please wait a moment.
        </p>

        {/* Chat-related animation: Typing dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin {
          animation: spin 1.5s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }

        @keyframes bounce-dot {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px); /* Adjust bounce height */
          }
        }
        .animate-bounce-dot {
          animation: bounce-dot 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default LoadingPage;
