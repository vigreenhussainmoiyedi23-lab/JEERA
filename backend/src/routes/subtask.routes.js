const express = require("express");
const Router = express.Router({ mergeParams: true });
const {
  createSubtask,
  getSubtasks,
  updateSubtask,
  deleteSubtask
} = require("../controllers/subtask.controllers");
const { UserIsLoggedIn } = require("../middlewares/UserAuth.middleware");

// Apply auth middleware to all routes
Router.use(UserIsLoggedIn);

// Base route -> /api/tasks/:taskId/subtasks
Router.post("/", createSubtask);
Router.get("/", getSubtasks);
Router.patch("/:subtaskId", updateSubtask);
Router.delete("/:subtaskId", deleteSubtask);

module.exports = Router;
