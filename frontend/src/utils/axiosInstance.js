import axios from "axios";

// Check if VITE_API_URL is set and contains /api, otherwise use fallback
const envURL = import.meta.env.VITE_API_URL;
const baseURL = envURL || "http://localhost:5000/api";

console.log("Environment VITE_API_URL:", envURL);
console.log("Final Axios baseURL:", baseURL);

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
        console.error("Axios error:", error);
        console.error("Error response:", error.response);
        
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

export default axiosInstance