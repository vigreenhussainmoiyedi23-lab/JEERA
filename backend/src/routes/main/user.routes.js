const express = require("express");
const Router = express.Router();
// sub routes
const authRoutes=require("../user/auth.routes")

Router.use("/auth",authRoutes)
module.exports = Router;
