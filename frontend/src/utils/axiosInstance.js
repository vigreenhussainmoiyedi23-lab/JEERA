import axios from "axios";

// Get the base URL from environment variables
const envURL = import.meta.env.VITE_API_URL;
const isDevelopment = import.meta.env.DEV;

// Debug logging in development
if (isDevelopment) {
    console.log("Environment VITE_API_URL:", envURL);
    console.log("Is Development:", isDevelopment);
}
// Construct the proper base URL
const getBaseURL = () => {
  if (isDevelopment) {
    return "http://localhost:5000/api";
  }
  
  if (envURL) {
    // If envURL already contains /api, use it as is
    if (envURL.endsWith('/api')) {
      return envURL;
    }
    // If envURL doesn't contain /api, append it
    return envURL.endsWith('/') ? `${envURL}api` : `${envURL}/api`;
  }
  
  // Fallback to localhost
  return "http://localhost:5000/api";
};

const baseURL = getBaseURL();

// Only log in development
if (isDevelopment) {
    console.log("Environment VITE_API_URL:", envURL);
    console.log("Final Axios baseURL:", baseURL);
}

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only log errors in development
        if (isDevelopment) {
            console.error("Axios error:", error);
            console.error("Error response:", error.response);
        }
        if (error.response?.status === 401) {
            const redirectTo = error.response?.data?.redirectTo;
            const target = redirectTo || "/login";
            if (window.location.pathname !== target) {
                window.location.href = target;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;