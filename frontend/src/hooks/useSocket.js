import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only create socket if it doesn't exist
    if (!socketInstance) {
      const getSocketUrl = () => {
        const envUrl = import.meta.env.VITE_API_URL;
        const isDevelopment = import.meta.env.DEV;
        
        if (isDevelopment) {
          return "http://localhost:5000";
        }
        
        // In production, check if we have a valid backend URL
        if (envUrl && envUrl.includes('localhost') === false) {
          // Convert HTTP to WS and HTTPS to WSS
          return envUrl.replace(/^http/, 'ws');
        }
        
        // In production without explicit backend URL, don't connect socket
        return null;
      };

      const socketUrl = getSocketUrl();

      if (socketUrl) {
        console.log("🔌 Creating socket connection to:", socketUrl);
        
        socketInstance = io(socketUrl, {
          withCredentials: true,
          transports: ["websocket", "polling"],
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
          autoConnect: false // Don't auto-connect immediately
        });

        // Manual connection with error handling
        socketInstance.connect();

        socketInstance.on('connect', () => {
          console.log('✅ Socket connected successfully');
          setIsConnected(true);
          setSocket(socketInstance);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error.message);
          setIsConnected(false);
          
          // Don't show socket errors to users in production
          if (import.meta.env.DEV) {
            console.log('🔄 This is expected in development if backend is not running');
          }
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('🔌 Socket disconnected:', reason);
          setIsConnected(false);
        });

      } else {
        console.log('🔌 Socket connection disabled (production without backend URL)');
        setIsConnected(false);
      }
    }

    return () => {
      // Don't disconnect on unmount to allow reuse
    };
  }, []);

  return {
    socket,
    isConnected,
    // Helper method to emit events safely
    emit: (event, data) => {
      if (socket && isConnected) {
        socket.emit(event, data);
        return true;
      }
      return false;
    },
    // Helper method to listen to events safely
    on: (event, callback) => {
      if (socket) {
        socket.on(event, callback);
        return () => socket.off(event, callback);
      }
      return () => {};
    }
  };
};

export default useSocket;
