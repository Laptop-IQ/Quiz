import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import NotificationBar from "../Context/NotificationBar";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // ✅ LOAD notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) setNotifications(JSON.parse(stored));
  }, []);

  // ✅ SAVE notifications to localStorage automatically
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  // ✅ ADD notification
  // message can now be string or JSX
  const addNotification = useCallback(
    (message, type = "info", options = {}) => {
      const newNotification = {
        id: Date.now() + Math.random(),
        message,
        type,
        read: false,
        createdAt: new Date(),
        duration: options.duration || 5000, // default 5s
        actions: options.actions || null, // custom buttons/actions
      };

      setNotifications((prev) => [newNotification, ...prev]);
      return newNotification.id; // return id to allow removal
    },
    [],
  );

  // ✅ REMOVE notification
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ✅ MARK ONE as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  // ✅ MARK ALL as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
      <NotificationBar />
    </NotificationContext.Provider>
  );
};
