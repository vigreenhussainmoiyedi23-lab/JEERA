import { io } from "socket.io-client";
import { getSocketConfig } from "./socketConfig";

const config = getSocketConfig();

// Only create socket if we have a valid URL
let socket = null;

if (config.url) {
  console.log("🔌 Connecting to socket at:", config.url);
  
  socket = io(config.url, config.options);
  
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
