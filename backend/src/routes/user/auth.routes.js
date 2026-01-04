const express = require("express");
const {
  RegisterValidator,
  validate,
  LoginValidator,
} = require("../../utils/express-validator.js");
const { authLimiter } = require("../../config/limiters.js");//a limiter for 5 requests per minute
const { LogoutHandler, VerifyOTP, LoginHandler, RegisterHandler } = require("../../controllers/user/user.auth.controller.js");


const Router = express.Router();

// Authentication - user.auth.controller.js

Router.post("/register",authLimiter, RegisterValidator, validate,RegisterHandler );
Router.post("/login",authLimiter, LoginValidator, validate,LoginHandler);
Router.post("/verifyOTP",authLimiter,VerifyOTP);
Router.post("/logout",authLimiter,LogoutHandler);

// profile related - user.profile.controller.js
module.exports = Router;
