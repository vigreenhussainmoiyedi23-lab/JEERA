const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    title: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    categoury: {
      type: String,
      enum: ["frontend", "backend", "devops", "debugging", "other"],
      default: "other",
    },
    taskStatus: {
      type: String,
      default: "toDo",
      enum: ["Inprogress", "cancelled", "finished","toDo"],
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "project" }
  },
  {
    toJSON: { virtuals: true }, // 👈 important
  }
);
const taskModel = mongoose.model("task", taskSchema);

module.exports = taskModel;
