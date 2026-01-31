require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const connectDBFallback = require("./config/db-fallback");
const initializeSockets = require("./socket/index"); // we'll create this soon

const app = require("./app");
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB with fallback
async function initializeDatabase() {
    try {
        await connectDB();
    } catch (error) {
        console.log('🔄 Main connection failed, trying fallback...');
        try {
            await connectDBFallback();
        } catch (fallbackError) {
            console.error('❌ All database connections failed');
            console.log('⚠️  Starting server without database - some features may not work');
        }
    }
}

// ✅ Connect to MongoDB
initializeDatabase();

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173/", // or specify your frontend domain
    // methods: ["GET", "POST","PUT","Patch"],
    credentials: true,
  },
});

// ✅ Attach socket event handlers
initializeSockets(io);

// ✅ Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
