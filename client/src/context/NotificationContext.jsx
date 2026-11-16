
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import socket from "../services/socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (data) => {
      setNotifications((prev) => [
        {
          ...data,
          id: Date.now()
        },
        ...prev
      ]);
    };

    socket.on("eventNotification", handleNotification);

    return () => {
      socket.off("eventNotification", handleNotification);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
