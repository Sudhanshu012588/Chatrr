import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(`${import.meta.env.VITE_BACKEND_BASE_URL}`);

function Bottom({ SenderID, ReciverId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !image.trim()) return;

    const newMessage = {
      SenderID,
      ReciverId,
      image,
      message: input,
      timestamp: Date.now(),
    };

    socket.emit('send_message', newMessage);
    setInput('');
    setImage('');
    setUploadComplete(false);
  };

  useEffect(() => {
    if (SenderID && ReciverId) {
      socket.emit('get_messages', {
        user1: SenderID,
        user2: ReciverId,
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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset'); // Replace with your Cloudinary preset
    formData.append('folder', 'public');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dzczys4gk/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await res.json();
    setImage(data.secure_url);
    setUploadComplete(true);
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-xl shadow-md">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === SenderID;
          return (
            <div
              key={index}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                  isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="sent"
                    className="w-40 h-auto rounded-md mb-1 object-cover"
                  />
                )}
                {msg.message && <p className="text-sm">{msg.message}</p>}
                <p className="text-xs text-right mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 flex flex-wrap gap-3 items-end sm:flex-nowrap">
        {/* Upload Button */}
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition shrink-0">
          📷
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* Image Preview */}
        {uploadComplete && image && (
          <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300 shrink-0">
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={() => {
                setImage('');
                setUploadComplete(false);
              }}
              className="absolute top-1 right-1 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center shadow hover:bg-red-500 hover:text-white transition"
              title="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 min-w-[120px] border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Bottom;
