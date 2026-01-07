const cookie = require("cookie");
const { VerifyToken } = require("../utils/jwt.js");
const chatSocket = require("./chat.socket.js");
const taskSocket = require("./task.socket.js");
const UserModel = require("../models/user.model.js");
function setupSocket(io) {
  // ✅ Track connected users (userId → socket.id)
  const socketIdMap = new Map();

  // ✅ Auth middleware for all socket connections
  io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("No cookies found"));

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;
    if (!token) return next(new Error("Token not found"));

    try {
      const decoded = VerifyToken(token);
      const user=await UserModel.findById(decoded.id)
      socket.user = user; // attach user info
      next();
    } catch (error) {
      console.error("❌ Invalid token:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ✅ On successful connection
  io.on("connection", (socket) => {
    const user = socket.user; // ensure consistency
    if (!user) {
      socket.disconnect();
      return;
    }
    // Save user in the map
    socketIdMap.set(user._id.toString(), socket.id);
    
    // Join project room
    socket.on("joinProject", (projectId) => {
      socket.join(projectId.toString());
    });

    // Leave project room
    socket.on("leaveProject", (projectId) => {
      socket.leave(projectId);
    });

    // Feature modules
    chatSocket(io, socket, socketIdMap);
    taskSocket(io, socket, socketIdMap);

    // Handle disconnect
    socket.on("disconnect", () => {
      socketIdMap.delete(user._id.toString());
    });
  });
}
module.exports= setupSocket
  