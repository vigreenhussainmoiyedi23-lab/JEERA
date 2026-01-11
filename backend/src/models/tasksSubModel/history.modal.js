const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      required: true
    },

    field: {
      type: String,
      required: true
    },

    oldValue: {
      type: String
    },

    newValue: {
      type: String
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    changeType: {
      type: String,
      enum: ["status", "priority", "assignment", "comment", "other"],
      default: "other"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("taskHistory", taskHistorySchema);
