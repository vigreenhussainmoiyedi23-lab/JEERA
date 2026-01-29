const mongoose = require("mongoose");
const TaskChatModel = require("../models/taskChat.model");
const TaskModel = require("../models/task.model");
const projectModel = require("../models/project.model");

// Send message
async function sendMessage(req, res) {
  try {
    const { taskId } = req.params;
    const { message, replyTo } = req.body;
    
    // Temporarily use mock user for testing when auth is disabled
    const userId = req.user?._id || new mongoose.Types.ObjectId();

    console.log("Sending message:", { taskId, message, replyTo, userId });

    // Verify task exists and user has access
    const task = await TaskModel.findById(taskId);
    if (!task) {
      console.log("Task not found:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }

    // Skip authorization check for testing when auth is disabled
    if (req.user) {
      // Verify user is project member
      const project = await projectModel.findById(task.project).populate("members.member");
      if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
        console.log("User not authorized:", userId);
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    const chatMessage = await TaskChatModel.create({
      message,
      task: taskId,
      sender: userId,
      replyTo
    });

    console.log("Chat message created:", chatMessage);

    const populatedMessage = await TaskChatModel.findById(chatMessage._id)
      .populate("sender", "username email profilePic")
      .populate("replyTo", "message sender")
      .populate("replyTo.sender", "username email profilePic");

    console.log("Populated message:", populatedMessage);
    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all messages for a task
async function getMessages(req, res) {
  try {
    const { taskId } = req.params;
    
    // Temporarily use mock user for testing when auth is disabled
    const userId = req.user?._id || new mongoose.Types.ObjectId();

    console.log("Getting messages for task:", taskId, "User:", userId);

    // Verify task exists and user has access
    const task = await TaskModel.findById(taskId);
    if (!task) {
      console.log("Task not found:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }

    // Skip authorization check for testing when auth is disabled
    if (req.user) {
      // Verify user is project member
      const project = await projectModel.findById(task.project).populate("members.member");
      if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
        console.log("User not authorized:", userId);
        return res.status(403).json({ message: "Not authorized" });
      }
    }

    const messages = await TaskChatModel.find({ task: taskId })
      .populate("sender", "username email profilePic")
      .populate("replyTo", "message sender")
      .populate("replyTo.sender", "username email profilePic")
      .sort({ createdAt: 1 });

    console.log("Found messages:", messages);
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Edit message
async function editMessage(req, res) {
  try {
    const { taskId, messageId } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    // Verify message exists and belongs to user
    const chatMessage = await TaskChatModel.findById(messageId);
    if (!chatMessage || chatMessage.task.toString() !== taskId) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (chatMessage.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this message" });
    }

    chatMessage.message = message;
    chatMessage.edited = true;
    chatMessage.editedAt = new Date();
    await chatMessage.save();

    const updatedMessage = await TaskChatModel.findById(messageId)
      .populate("sender", "username email profilePic")
      .populate("replyTo", "message sender")
      .populate("replyTo.sender", "username email profilePic");

    res.status(200).json({ message: updatedMessage });
  } catch (error) {
    console.error("Edit message error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

// Delete message
async function deleteMessage(req, res) {
  try {
    const { taskId, messageId } = req.params;
    const userId = req.user._id;

    // Verify message exists and belongs to user
    const chatMessage = await TaskChatModel.findById(messageId);
    if (!chatMessage || chatMessage.task.toString() !== taskId) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (chatMessage.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await TaskChatModel.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

// Add reaction
async function addReaction(req, res) {
  try {
    const { taskId, messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    // Verify message exists
    const chatMessage = await TaskChatModel.findById(messageId);
    if (!chatMessage || chatMessage.task.toString() !== taskId) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify user is project member
    const task = await TaskModel.findById(taskId);
    const project = await projectModel.findById(task.project).populate("members.member");
    if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if user already reacted with this emoji
    const existingReaction = chatMessage.reactions.find(
      r => r.user.toString() === userId.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if it exists
      chatMessage.reactions = chatMessage.reactions.filter(
        r => !(r.user.toString() === userId.toString() && r.emoji === emoji)
      );
    } else {
      // Add new reaction
      chatMessage.reactions.push({
        user: userId,
        emoji,
        createdAt: new Date()
      });
    }

    await chatMessage.save();

    const updatedMessage = await TaskChatModel.findById(messageId)
      .populate("sender", "username email profilePic")
      .populate("reactions.user", "username email profilePic");

    res.status(200).json({ message: updatedMessage });
  } catch (error) {
    console.error("Add reaction error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

// Copy message
async function copyMessage(req, res) {
  try {
    const { taskId, messageId } = req.params;
    const userId = req.user._id;

    // Verify message exists and user has access
    const chatMessage = await TaskChatModel.findById(messageId);
    if (!chatMessage || chatMessage.task.toString() !== taskId) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Verify user is project member
    const task = await TaskModel.findById(taskId);
    const project = await projectModel.findById(task.project).populate("members.member");
    if (!project || !project.members.some(m => m.member?._id?.toString() === userId.toString())) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Return the message text for copying
    res.status(200).json({ message: chatMessage.message });
  } catch (error) {
    console.error("Copy message error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  addReaction,
  copyMessage
};
