const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    goal: {
      type: String
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true
    },

    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned"
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("sprint", sprintSchema);
