const express = require("express");
const Router = express.Router();
// sub routes
const authRoutes = require("../user/auth.routes")
const postRoutes = require("../user/post.routes")
const otherRoutes = require("../user/other.routes");
const profileRoutes = require("../user/profile.routes");
const { UserIsLoggedIn } = require("../../middlewares/UserAuth.middleware");
Router.use("/auth", authRoutes)
Router.use("/other",UserIsLoggedIn,otherRoutes)
Router.use("/profile",UserIsLoggedIn,profileRoutes)
Router.use("/post",UserIsLoggedIn,postRoutes)
module.exports = Router;
