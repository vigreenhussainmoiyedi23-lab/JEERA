const UserModel = require("../models/user.model");
const { VerifyToken } = require("../utils/jwt");

async function UserIsLoggedIn(req, res, next) {
  const token = req.cookies?.token || null;
  if (!token)
    return res
      .status(401)
      .json({ message: "No token found", redirectTo: "/login" });

  const decoded = VerifyToken(token);
  if (!decoded.id)
    return res
      .status(401)
      .json({ message: "Invalid Token", redirectTo: "/login" });
  const user = await UserModel.findById(decoded.id);
  
  if (!user)
    return res
      .status(401)
      .json({ message: "you need to login first", redirectTo: "/login" });
  req.user = user;
  next()
}

module.exports = {
  UserIsLoggedIn,
};
