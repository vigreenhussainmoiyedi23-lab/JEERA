const express = require("express");
const {
  ProfileIndexHandler,
  UpdateHandler,
  ProfileByIdHandler,
  ToggleFollowHandler,
  ToggleConnectHandler,
  RejectConnectionRequestHandler,
  SearchUsersHandler,
} = require("../../controllers/user/profile.controllers");

const Router = express.Router();

Router.get("/", ProfileIndexHandler);
Router.patch("/update", UpdateHandler);
Router.get("/view/:userId", ProfileByIdHandler);
Router.post("/follow/:userId", ToggleFollowHandler);
Router.post("/connect/:userId", ToggleConnectHandler);
Router.post("/reject/:userId", RejectConnectionRequestHandler);
Router.post("/search", SearchUsersHandler);

module.exports = Router;
