import React from 'react';
import Navbar from '../components/Navbar';
import Top from '../ChattComp/Top';
import useStore from '../Store/Store';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './Dashboard';
import Bottom from '../ChattComp/Bottom';
import { useEffect } from 'react';
function ChattPage() {
  const pop = useStore((state) => state.popadmin);
  const friendId = useStore((state)=>state.friendId)
  const userId = useStore((state)=>state.User._id)

  useEffect(() => {
    console.log(friendId)
  }, [])
  
  return (
    <>
      <Navbar />
      <Top />
    {friendId &&
      (
        <Bottom SenderID={userId} ReciverId={friendId} />

      )
    }
    
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
