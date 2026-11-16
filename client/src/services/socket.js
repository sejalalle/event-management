
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL || "https://event-management-v34x.onrender.com",
  {
    autoConnect: true,
    reconnection: true,
  }
);

export default socket;
