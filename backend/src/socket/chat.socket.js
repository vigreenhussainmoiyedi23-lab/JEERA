const ChatModel = require("../models/chat.model");

function chatSocket(io, socket) {
  // ✅ Listen for messages
  socket.on("sendMessage", async ({ projectId, message }) => {
    const senderId = socket.user.id;

    // Save to DB
    const chat = await ChatModel.create({
      project: projectId,
      sender: senderId,
      message,
    });

    // Broadcast message to everyone in the same project room
    io.to(projectId).emit("newMessage", chat);
  });
}

module.exports = chatSocket;
