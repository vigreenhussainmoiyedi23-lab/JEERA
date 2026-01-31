const express = require("express");
const router = express.Router();

// Health check endpoint
router.get("/islive", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;
    
    // Database connection states
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    const isDbConnected = dbState === 1;
    const isDbConnecting = dbState === 2;
    
    // Check if database is connected or connecting
    if (isDbConnected || isDbConnecting) {
      return res.status(200).json({
        status: "healthy",
        message: isDbConnected ? "Backend is live and database connected" : "Backend is live and database connecting",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: dbStates[dbState],
        readyState: dbState
      });
    } else {
      return res.status(500).json({
        status: "unhealthy",
        message: "Backend is running but database is not connected",
        timestamp: new Date().toISOString(),
        database: dbStates[dbState],
        readyState: dbState
      });
    }
  } catch (error) {
    console.error("Health check error:", error);
    return res.status(500).json({
      status: "unhealthy",
      message: "Backend is experiencing issues",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Simple ping endpoint
router.get("/ping", (req, res) => {
  res.status(200).json({
    message: "pong",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
