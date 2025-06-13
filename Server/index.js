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

const app = express();
dotenv.config({ path: './.env' });

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;
connectDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// 🔌 Socket.io connection
io.on('connection', (socket) => {
  //console.log(`🟢 User connected: ${socket.id}`);

  // ✅ Fetch chat history
  socket.on('get_messages', async ({ user1, user2 }) => {
    if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
      return socket.emit('messages_history', []);
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 }).lean();
    //console.log(messages)
    socket.emit('messages_history', messages);
  });

  // ✅ Receive and forward message
  socket.on('send_message', async (data) => {
    try {
      const newMessage = await Message.create({
        sender: data.SenderID,
        receiver: data.ReciverId,
        message: data.message,
        timestamp: new Date()
      });

      // Notify both sender and receiver
      io.emit('receive_message', newMessage);
    } catch (err) {
      console.error("❌ Message error:", err.message);
    }
  });

  socket.on('disconnect', () => {
    //console.log(`🔴 Disconnected: ${socket.id}`);
  });
});

app.use('/user', userRouter);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
