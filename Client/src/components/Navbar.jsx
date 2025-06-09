import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigator = useNavigate();
  return (
    <nav className="w-full h-[10vh] bg-white flex items-center justify-between px-6 md:px-12 shadow-lg z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/chat.png" alt="ChatApp Logo" className="h-10 w-10 object-contain" />
        <span className="text-blue-600 font-extrabold text-2xl tracking-tight">ChatApp</span>
      </div>

      {/* Navigation Links (Hidden on small screens, shown on md and up) */}
      <div className="hidden md:flex items-center gap-8">
        <a href="/" className="relative group text-gray-700 font-medium text-lg hover:text-blue-600 transition-colors duration-200">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="/chat" className="relative group text-gray-700 font-medium text-lg hover:text-blue-600 transition-colors duration-200">
          Chat
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="/about" className="relative group text-gray-700 font-medium text-lg hover:text-blue-600 transition-colors duration-200">
          About
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
        </a>
      </div>

      {/* Action Button (e.g., Login/Signup) */}
      <div className="hidden md:flex items-center">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-md"
          onClick={()=>navigator('/login')}
        >
          Login
        </button>
      </div>

      {/* Hamburger Icon for Mobile (Placeholder for actual mobile menu) */}
      <div className="md:hidden flex items-center">
        <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4"></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;