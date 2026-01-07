import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL

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
        if (error.response?.status === 401) {
            // automatically redirect to login
            window.location.href = "/login";
        }
        if (error.response?.status === 403)
            window.history.back()

        return Promise.reject(error);
    }
);

export default axiosInstance