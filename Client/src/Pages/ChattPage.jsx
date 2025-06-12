import React from 'react';
import Navbar from '../components/Navbar';
import Top from '../ChattComp/Top';
import useStore from '../Store/Store';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './Dashboard';

function ChattPage() {
  const pop = useStore((state) => state.popadmin);

  return (
    <>
      <Navbar />
      <Top />

      <h1 className="text-xl m-6 font-semibold">hey we are fine</h1>

      <AnimatePresence>
        {pop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-[15vh] right-8 w-[350px] bg-white rounded-xl shadow-2xl z-50 p-4 border border-gray-200"
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChattPage;
