const { VerifyToken } = require("../utils/jwt");
const chatSocket = require("./chat.socket");
const taskSocket = require("./task.socket");

function initializeSockets(io) {
  // ✅ Middleware: Authenticate socket connections using JWT
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) return next(new Error("No cookies found"));

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token; // your JWT or session token
    if (!token) {
      return next(new Error("Token Not Found"));
    }
    try {
      const decoded = VerifyToken(token); // your existing VerifyToken function
      socket.user = decoded; // attach user to socket instance
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // ✅ Connection
  io.on("connection", (socket) => {
 
    // Join project room
    socket.on("joinProject", (projectId) => {
      socket.join(projectId);
      console.log(`📦 ${socket.user.id} joined project: ${projectId}`);
    });
    socket.on("jointask", (taskid) => {
      socket.join(taskid);
      console.log(`📦 ${socket.user.id} joined task: ${taskid}`);
    });
    socket.on("leavetask", (taskid) => {
      socket.leave(taskid);
      console.log(`📦 ${socket.user.id} left task: ${taskid}`);
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
