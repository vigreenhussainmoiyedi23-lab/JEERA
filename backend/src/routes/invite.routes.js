const express = require("express");
const Router = express.Router();
const {
  getInvites,
  acceptInvite,
  rejectInvite
} = require("../controllers/invite.controllers");

// Get all invites (connection requests, project invites)
Router.get("/", getInvites);

// Accept an invite
Router.post("/accept", acceptInvite);

// Reject an invite
Router.post("/reject", rejectInvite);

module.exports = Router;
