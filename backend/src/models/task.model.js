const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: String,

    issueType: {
      type: String,
      enum: ["task", "bug", "story", "epic",""],
      default: "task"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical", "highest",""],
      default: "medium"
    },

    taskStatus: {
      type: String,
      enum: ["toDo", "Inprogress", "Inreview", "done", "Failed"],
      default: "toDo"
    },

    category: {
      type: String,
      enum: ["frontend", "backend", "devops", "debugging", "other",""],
      default: "other"
    },

    storyPoints: {
      type: Number,
      min: 0 //1, 2, 3, 5, 8, 13, 21
    },

    labels: [String],

    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true
    },

    history: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskHistory"
    }],

    attachments: [
      {
        fileId: String,
        url: String
      }
    ],

    dueDate: {type:Date,default:Date.now},

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

module.exports = mongoose.model("task", taskSchema);
