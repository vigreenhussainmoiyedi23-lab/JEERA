const express = require("express");
const Router = express.Router();
const {
  getInviteableProjects,
  inviteToProject
} = require("../controllers/projectInvite.controllers");
const { UserIsLoggedIn } = require("../middlewares/UserAuth.middleware");

// Apply auth middleware to all routes
Router.use(UserIsLoggedIn);

// Get projects where current user can invite the target user
Router.get("/projects/:userId", getInviteableProjects);

// Invite a user to a project
Router.post("/invite", inviteToProject);

module.exports = Router;
