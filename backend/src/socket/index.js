const cookie = require("cookie");
const { VerifyToken } = require("../utils/jwt.js");
const chatSocket = require("./chat.socket.js");
const taskSocket = require("./task.socket.js");
function setupSocket(io) {
  // ✅ Track connected users (userId → socket.id)
  const socketIdMap = new Map();

  // ✅ Auth middleware for all socket connections
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("No cookies found"));

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;
    if (!token) return next(new Error("Token not found"));

    try {
      const decoded = VerifyToken(token);
      socket.user = decoded; // attach user info
      next();
    } catch (error) {
      console.error("❌ Invalid token:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ✅ On successful connection
  io.on("connection", (socket) => {
    const userId = socket.user?.id; // ensure consistency
    if (!userId) {
      console.error("⚠️ Missing user ID in socket");
      socket.disconnect();
      return;
    }

    // Save user in the map
    socketIdMap.set(userId.toString(), socket.id);
    console.log(`🟢 User ${userId} connected with socket ${socket.id}`);

    // Join project room
    socket.on("joinProject", (projectId) => {
      socket.join(projectId);
      console.log(`📦 User ${userId} joined project: ${projectId}`);
    });

    // Leave project room
    socket.on("leaveProject", (projectId) => {
      socket.leave(projectId);
      console.log(`🚪 User ${userId} left project: ${projectId}`);
    });

    // Feature modules
    chatSocket(io, socket, socketIdMap);
    taskSocket(io, socket, socketIdMap);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`🔴 User ${userId} disconnected`);
      socketIdMap.delete(userId.toString());
    });
  });
}
module.exports= setupSocket
  