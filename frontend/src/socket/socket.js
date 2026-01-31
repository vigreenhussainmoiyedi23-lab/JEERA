import { io } from "socket.io-client";

// Get the socket URL from environment variables
const getSocketURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return "http://localhost:5000";
  }
  
  if (envURL) {
    // Remove /api from the URL for socket connection
    // Convert: https://domain.com/api -> https://domain.com
    return envURL.replace('/api', '');
  }
  
  // Fallback to localhost
  return "http://localhost:5000";
};

const socketURL = getSocketURL();

// Only create socket if we have a valid URL
let socket = null;

if (socketURL) {
  socket = io(socketURL, {
    withCredentials: true,
    transports: ["websocket", "polling"], // Add polling as fallback
    timeout: 10000,
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
  });
  
  // Add connection event listeners for debugging
  socket.on('connect', () => {
    console.log('✅ Socket connected successfully');
  });
  
  socket.on('connect_error', (error) => {
    // Only show errors in development
    if (import.meta.env.DEV) {
      console.error('❌ Socket connection error:', error.message);
      console.log('🔄 This is expected if backend is not running');
    }
  });
  
  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });
} else {
  console.log('🔌 Socket connection disabled (no backend URL configured)');
}

export default socket;
