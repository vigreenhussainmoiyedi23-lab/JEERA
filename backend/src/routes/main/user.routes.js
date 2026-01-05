const express = require("express");
const Router = express.Router();
// sub routes
const authRoutes = require("../user/auth.routes")
const otherRoutes = require("../user/other.routes");
const { UserIsLoggedIn } = require("../../middlewares/UserAuth.middleware");
Router.use("/auth", authRoutes)
Router.use("/other",UserIsLoggedIn,otherRoutes)
module.exports = Router;
