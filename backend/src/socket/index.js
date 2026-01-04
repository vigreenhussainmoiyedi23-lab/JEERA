const { VerifyToken } = require("../utils/jwt");
const chatSocket = require("./chat.socket");
const taskSocket = require("./task.socket");

function initializeSockets(io) {
  // ✅ Middleware: Authenticate socket connections using JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const user = VerifyToken(token); // your existing VerifyToken function
      socket.user = user; // attach user to socket instance
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ✅ Connection
  io.on("connection", (socket) => {
    console.log(`🟢 ${socket.user.id} connected: ${socket.id}`);

    // Join project room
    socket.on("joinProject", (projectId) => {
      socket.join(projectId);
      console.log(`📦 ${socket.user.id} joined project: ${projectId}`);
    });

    // Leave project room
    socket.on("leaveProject", (projectId) => {
      socket.leave(projectId);
      console.log(`🚪 ${socket.user.id} left project: ${projectId}`);
    });

    // Initialize feature-specific sockets
    chatSocket(io, socket);
    taskSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`🔴 ${socket.user.id} disconnected`);
    });
  });
}

module.exports = { initializeSockets };
