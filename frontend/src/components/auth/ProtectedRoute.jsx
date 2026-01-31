import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { authUtils } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if user is authenticated using authUtils
        if (authUtils.isAuthenticated()) {
          const user = authUtils.getUser();
          console.log("User is authenticated:", user);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // If no stored user, check with backend via protected endpoint
        console.log("No user in localStorage, checking with backend...");
        const response = await axiosInstance.get('/user/profile');
        
        if (response.status === 200) {
          // Store user data from backend response
          authUtils.setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log("Authentication check failed:", error.response?.status);
        
        // Clear any stale user data
        authUtils.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-16 h-16 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
