const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["toDo", "inProgress", "done"],
    default: "toDo"
  },
  parentTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  history: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaskHistory"
  }]
}, {
  timestamps: true
});

// Index for faster queries
subtaskSchema.index({ parentTask: 1, status: 1 });
subtaskSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Subtask", subtaskSchema);
