const express = require("express");
const Router = express.Router({ mergeParams: true });
const {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  addReaction,
  copyMessage
} = require("../controllers/taskChat.controllers");
const { UserIsLoggedIn } = require("../middlewares/UserAuth.middleware");

// Apply auth middleware to all routes
Router.use(UserIsLoggedIn);

// Base route -> /api/tasks/:taskId/chat
Router.post("/", sendMessage);
Router.get("/", getMessages);
Router.patch("/:messageId", editMessage);
Router.delete("/:messageId", deleteMessage);
Router.post("/:messageId/react", addReaction);
Router.get("/:messageId/copy", copyMessage);

module.exports = Router;
