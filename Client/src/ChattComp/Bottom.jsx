import React, { useState, useEffect,useRef  } from 'react';
import { io } from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BACKEND_BASE_URL}`);

function Bottom({ SenderID, ReciverId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
const bottomRef = useRef(null);
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

  const handleSend = () => {
  if (!input.trim()) return;

  const newMessage = {
    SenderID,
    ReciverId,
    message: input,
    timestamp: Date.now()
  };
  ////console.log.log.log(newMessage)
  socket.emit('send_message', newMessage);
  setInput(''); // Clear input only
};


  useEffect(() => {
    if (SenderID && ReciverId) {
      socket.emit('get_messages', {
        user1: SenderID,
        user2: ReciverId
      });
    }

    socket.on('messages_history', (data) => {
      setMessages(data || []);
    });

    socket.on('receive_message', (newMsg) => {
      const isCurrentChat =
        (newMsg.sender === SenderID && newMsg.receiver === ReciverId) ||
        (newMsg.sender === ReciverId && newMsg.receiver === SenderID);

      if (isCurrentChat) {
        setMessages((prev) => [...prev, newMsg]);
        
      }
    });

    return () => {
      socket.off('messages_history');
      socket.off('receive_message');
    };
  }, [SenderID, ReciverId]);


 
  
  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-xl shadow-md">
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === SenderID;
          return (
            <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />

      </div>

      <div className="border-t p-4 flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Bottom;
