import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useStore from '../Store/Store';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isVerified = useStore((state) => state.isVerified);
  const setIsVerified = useStore((state) => state.setIsVerified);
  const user = useStore((state) => state.User);
  const profilephoto = useStore((state) => state.profilephoto);
  const pop = useStore((state) => state.popadmin);
  const setPopAdmin = useStore((state) => state.setPopAdmin);
    const loggedin = useStore((state) => state.loggedin);

  // Auto-close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check verification
  useEffect(() => {
    if (user?.name && user?.email) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [user]);

  const handleProfileClick = () => setPopAdmin(!pop);

  return (
    <nav className="w-full h-[10vh] bg-white flex items-center justify-between px-4 md:px-12 shadow z-50 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/chat.png" alt="ChatApp Logo" className="h-10 w-10 object-contain" />
        <span className="text-blue-600 font-extrabold text-2xl tracking-tight">ChatApp</span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        {['Home', 'Chat', 'About'].map((item) => (
          <Link
            key={item}
            to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
            className="relative group text-gray-700 font-medium text-lg hover:text-blue-600 transition-colors duration-200"
          >
            {item}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}
      </div>
      
      
      {/* Desktop Profile/Login */}
      <div className="hidden md:flex items-center">
        {loggedin ? (
          <button onClick={handleProfileClick} className="w-12 h-12 rounded-full overflow-hidden hover:scale-105 transition-transform">
            <img
              src={user.profilephoto}
              alt="user"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = '/user.png')}
            />
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Login
          </button>
        )}
      </div>

      {/* Hamburger (Mobile) */}
      <div className="md:hidden flex items-center">
        <button
          className="text-gray-700 hover:text-blue-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-[10vh] left-0 w-full bg-white shadow-md md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-4 p-6">
          {['Home', 'Chat', 'About'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
              className="text-gray-700 font-medium text-lg hover:text-blue-600 transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
          {loggedin ? (
            <button
              onClick={handleProfileClick}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Profile
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
