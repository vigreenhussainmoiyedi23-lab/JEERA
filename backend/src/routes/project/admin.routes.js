const express = require("express");
const Router = express.Router();
const {
  EditProjectHandler,
  InviteMemberHandler,
  PromoteHandler,
  RemoveMemberHandler,
  UnbanMemberHandler,
  AdminAnalyticsHandler,
} = require("../../controllers/project/project.admin.controllers");
const { ProjectValidator, validate } = require("../../utils/express-validator");

// base Route --> /api/project/admin
// admin only feature
Router.patch(
  "/edit/:projectid",
  ProjectValidator,
  validate,
  EditProjectHandler
);
Router.post("/invite/:projectid/:userid", InviteMemberHandler);
Router.delete("/remove/:projectid/:userid", RemoveMemberHandler);
Router.post("/unban/:projectid/:userid", UnbanMemberHandler);
Router.patch("/promote/:projectid/:userid/:to", PromoteHandler);

Router.get("/analytics/:projectid", AdminAnalyticsHandler);


module.exports = Router;
