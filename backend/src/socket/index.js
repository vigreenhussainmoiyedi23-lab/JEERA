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
      const user = await UserModel.findById(decoded.id)
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
    const userId = user._id.toString();

    if (!socketIdMap.has(userId)) {
      socketIdMap.set(userId, new Set());
    }

    socketIdMap.get(userId).add(socket.id);
    // Feature modules
    chatSocket(io, socket, socketIdMap);
    taskSocket(io, socket, socketIdMap);

    // Handle disconnect
    socket.on("disconnect", () => {
      const set = socketIdMap.get(userId);
      if (!set) return;

      set.delete(socket.id);
      if (set.size === 0) {
        socketIdMap.delete(userId);
      }
    });
  });
}
module.exports = setupSocket
