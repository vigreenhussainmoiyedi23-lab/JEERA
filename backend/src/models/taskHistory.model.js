const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    oldValue: String,
    newValue: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("taskHistory", taskHistorySchema);
