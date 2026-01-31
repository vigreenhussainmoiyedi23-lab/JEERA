// Socket configuration for different environments
export const socketConfig = {
  // Development configuration
  development: {
    url: "http://localhost:5000",
    options: {
      withCredentials: true,
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }
  },
  
  // Production configuration
  production: {
    url: null, // Will be set dynamically
    options: {
      withCredentials: true,
      transports: ["polling"], // Use polling in production for better compatibility
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 2,
      reconnectionDelay: 2000,
    }
  }
};

// Get the appropriate configuration
export const getSocketConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  const env = isDevelopment ? 'development' : 'production';
  const config = socketConfig[env];
  
  if (isDevelopment) {
    return config;
  }
  
  // In production, try to get the backend URL
  const apiURL = import.meta.env.VITE_API_URL;
  
  if (apiURL && !apiURL.includes('localhost')) {
    // Convert API URL to socket URL
    const socketURL = apiURL.replace(/^http/, 'ws');
    return {
      ...config,
      url: socketURL
    };
  }
  
  // Return config with null URL (socket will be disabled)
  return config;
};

export default getSocketConfig;
