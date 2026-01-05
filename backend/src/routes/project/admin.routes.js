const express = require("express");
const Router = express.Router();
const {
  EditProjectHandler,
  InviteMemberHandler,
  PromoteHandler,
  RemoveMemberHandler,
} = require("../../controllers/project/project.admin.controllers");

// base Route --> /api/project/admin
// admin only feature
Router.patch(
  "/edit/:projectid",
  ProjectValidator,
  validate,
  EditProjectHandler
);
Router.post("/invite/:projectid/:userid", InviteMemberHandler);
Router.delete("/remove/:projectid/:userid/:from", RemoveMemberHandler);
Router.patch("/promote/:projectid/:userid/:to", PromoteHandler);


module.exports = Router;
