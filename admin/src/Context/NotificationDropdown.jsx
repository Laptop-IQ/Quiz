import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../Context/NotificationProvider";
import { motion } from "framer-motion";
const NotificationDropdown = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Bell Button */}
        <motion.button
          onClick={() => setOpen((prev) => !prev)}
          className="relative p-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white"
          animate={
            unreadCount > 0
              ? { rotate: [0, -15, 15, -10, 10, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 0.6,
            repeat: unreadCount > 0 ? Infinity : 0,
            repeatDelay: 3,
          }}
        >
          <Bell size={24} />

          {unreadCount > 0 && (
            <motion.span
              key={unreadCount} // 🔥 important (re-trigger animation)
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white shadow-xl rounded-xl overflow-y-auto border z-50">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="font-semibold text-gray-700">Notifications</h3>
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            </div>

            <div className="flex flex-col">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`flex flex-col gap-1 px-4 py-3 cursor-pointer border-b hover:bg-gray-100 ${
                    n.read ? "bg-gray-50" : "bg-gray-100 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        n.type === "success"
                          ? "bg-green-500"
                          : n.type === "error"
                            ? "bg-red-500"
                            : n.type === "info"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                      }`}
                    />
                    <p className="text-sm flex-1">{n.message}</p>
                  </div>

                  <p className="text-xs text-gray-400 ml-6">
                    {new Date(n.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default NotificationDropdown;
