import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div className="col-span-1">
          <div className="flex items-center mb-4">
            <img src="/chat.png" alt="ChatApp Logo" className="h-8 w-8 object-contain mr-2" />
            <span className="text-white font-extrabold text-2xl">ChatApp</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Connect, chat, and collaborate instantly with your community. Fast, secure, and beautifully simple.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 text-sm">Home</a></li>
            <li><a href="/chat" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 text-sm">Chat</a></li>
            <li><a href="/about" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 text-sm">About Us</a></li>
            <li><a href="/contact" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 text-sm">Contact</a></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="/faq" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 text-sm">FAQ</a></li>
            <li><a href="/privacy" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 text-sm">Privacy Policy</a></li>
            <li><a href="/terms" className="text-gray-400 hover:text-blue-500 transition-colors duration-200 text-sm">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Info / Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com/chatapp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
              {/* Replace with actual SVG or icon component */}
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a href="https://twitter.com/chatapp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
              {/* Replace with actual SVG or icon component */}
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com/chatapp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
              {/* Replace with actual SVG or icon component */}
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;