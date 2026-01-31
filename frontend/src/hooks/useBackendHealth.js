import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const useBackendHealth = () => {
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkBackendHealth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/health/islive');
      
      if (response.status === 200) {
        setIsBackendLive(true);
        setError(null);
        setRetryCount(0);
      } else {
        setIsBackendLive(false);
        setError('Backend is not responding correctly');
      }
    } catch (err) {
      setIsBackendLive(false);
      setError(err.response?.data?.message || 'Backend is not available');
      console.error('Backend health check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    // Initial check
    checkBackendHealth();

    // Set up polling every 30 seconds if backend is live
    if (isBackendLive) {
      intervalId = setInterval(checkBackendHealth, 30000);
    } else {
      // If backend is not live, check every 5 seconds with retry logic
      intervalId = setInterval(() => {
        setRetryCount(prev => prev + 1);
        checkBackendHealth();
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isBackendLive]);

  // Manual retry function
  const retry = () => {
    setRetryCount(prev => prev + 1);
    checkBackendHealth();
  };

  return {
    isBackendLive,
    isLoading,
    error,
    retryCount,
    retry,
    checkBackendHealth
  };
};
