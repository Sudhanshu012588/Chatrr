import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
function Homepage() {
  const navigator  = useNavigate()
  return (
    <>
    <div className='fixed top-0 left-0 w-full h-[10vh] z-1'>
      <Navbar />
    </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4 py-16">
        <div className="bg-white max-w-5xl w-full rounded-3xl p-8 md:p-12 text-center shadow-2xl transform hover:scale-102 transition-transform duration-300 ease-in-out">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
            Welcome to <span className="text-blue-600">ChatApp</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect, chat, and collaborate instantly with your community. Fast, secure, and beautifully simple.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
            onClick={()=>navigator('/signup')}
            >
              Get Started
            </button>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl">
              Learn More
            </button>
          </div>
        </div>
        <div>
        </div>
      </div>
          <Footer/>
    </>
  );
}

export default Homepage;