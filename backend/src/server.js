require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const  initializeSockets  = require("./socket/index"); // we'll create this soon

const app = require("./app");
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // or specify your frontend domain
    methods: ["GET", "POST"],
  },
});

// ✅ Attach socket event handlers
initializeSockets(io);

// ✅ Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
