import { io } from "socket.io-client";
const baseurl=import.meta.env.VITE_API_URL || "http://localhost:5000"
const socket = io(baseurl, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
