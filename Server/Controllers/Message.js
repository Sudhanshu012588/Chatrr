// controllers/messageController.js
import Message from "../Models/Message.js";
import Chat from "../Models/ChatModel.js";

export const sendMessage = async (req, res) => {
  const { sender, receiver, message, chatId } = req.body;

  if (!sender || !receiver || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      chatId,
    });

    // Optional: update latest message
    if (chatId) {
      await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage._id });
    }

    // Emit through socket (if using socket in route/controller)
    req.app.get("io").to(receiver).emit("receive_message", newMessage);

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message" });
  }
};


export const getMessages = async (req, res) => {
  const { chatId, page = 1, limit = 20 } = req.query;

  try {
    const messages = await Message.find({ chatId })
      .sort({ timestamp: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({ messages: messages.reverse() }); // reverse for ascending order
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};


export const markAsSeen = async (req, res) => {
  const { messageId } = req.body;

  try {
    await Message.findByIdAndUpdate(messageId, { seen: true });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark as seen" });
  }
};
