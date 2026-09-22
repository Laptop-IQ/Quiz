import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { CheckCircle, XCircle, Bell } from "lucide-react";
import { useNotifications } from "./NotificationProvider";
import { useEffect, useRef, useState } from "react";

// Single Notification Item
const NotificationItem = ({ n, removeNotification }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotate = useTransform(x, [-200, 0, 200], [-6, 0, 6]);

  // Timer for auto-dismiss
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (n.duration && n.duration > 0 && !isPaused) {
      timerRef.current = setTimeout(() => removeNotification(n.id), n.duration);
      return () => clearTimeout(timerRef.current);
    }
  }, [n.id, n.duration, removeNotification, isPaused]);

  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      style={{ x, opacity, rotate }}
      onDragEnd={(event, info) => {
        if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 600) {
          removeNotification(n.id);
        }
      }}
      initial={{ opacity: 0, x: 120, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 200, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative pointer-events-auto cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-3 rounded-xl shadow-xl backdrop-blur-lg border min-w-[260px] max-w-sm
          ${
            n.type === "success"
              ? "bg-green-500/90 border-green-300 text-white"
              : n.type === "error"
                ? "bg-red-500/90 border-red-300 text-white"
                : n.type === "info"
                  ? "bg-blue-500/90 border-blue-300 text-white"
                  : n.type === "warning"
                    ? "bg-yellow-500/90 border-yellow-300 text-black"
                    : "bg-gray-500/90 border-gray-300 text-white"
          }`}
      >
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          {n.type === "success" ? (
            <CheckCircle size={20} />
          ) : n.type === "error" ? (
            <XCircle size={20} />
          ) : (
            <Bell size={20} />
          )}
        </div>

        {/* Message */}
        <div className="flex-1 text-sm font-medium p-2">{n.message}</div>

        {/* Actions */}
        {n.actions && (
          <div className="flex gap-2 mt-2 sm:mt-0">
            {n.actions.map((a, i) => (
              <button
                key={i}
                onClick={() => {
                  a.onClick?.();
                  removeNotification(n.id);
                }}
                className={a.className}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      {typeof n.duration === "number" && n.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-b-xl"
          initial={{ width: "100%" }}
          animate={{ width: isPaused ? "100%" : 0 }}
          transition={{
            duration: n.duration / 1000,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
};

// Main Notification Bar
const NotificationBar = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute top-[25%] right-4 flex flex-col items-end gap-2">
        <AnimatePresence>
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              n={n}
              removeNotification={removeNotification}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationBar;
