import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import connectDB from "./DB/DBconfig.js";
import userRouter from "./Routes/UserRoutes.js";
import Message from "./Models/Message.js";

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach io instance to app for global access
app.set("io", io);

// Database connection
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/user', userRouter);

// Socket.IO handling
io.on('connection', (socket) => {
  // console.log(`🟢 Connected: ${socket.id}`);

  // Fetch previous chat messages
  socket.on('get_messages', async ({ user1, user2 }) => {
    if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
      return socket.emit('messages_history', []);
    }

    try {
      const messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      }).sort({ timestamp: 1 }).lean();

      socket.emit('messages_history', messages);
    } catch (err) {
      console.error("❌ Error fetching messages:", err.message);
      socket.emit('messages_history', []);
    }
  });

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      if (data.message?.trim() || data.image?.trim()) {
        const newMessage = await Message.create({
          sender: data.SenderID,
          receiver: data.ReciverId,
          message: data.message || '',
          image: data.image || '',
          timestamp: new Date(),
        });

        // Send to all connected clients
        io.emit('receive_message', newMessage);
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err.message);
    }
  });

  socket.on('disconnect', () => {
    // console.log(`🔴 Disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
