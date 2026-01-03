const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    coAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    createdAt: { type: Date, default: Date.now },
    chats: [
      {
        message: String,
        User: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        CreatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    newMessages: [
      {
        title: String,
        User: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        CreatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    allTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task" }],
  },
  {
    toJSON: { virtuals: true }, // 👈 important
  }
);

const projectModel = mongoose.model("project", projectSchema);

module.exports = projectModel;
