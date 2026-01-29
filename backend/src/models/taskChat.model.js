const mongoose = require("mongoose");

const taskChatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    emoji: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskChat"
  }
}, {
  timestamps: true
});

// Index for faster queries
taskChatSchema.index({ task: 1, createdAt: -1 });
taskChatSchema.index({ sender: 1 });

module.exports = mongoose.model("TaskChat", taskChatSchema);
