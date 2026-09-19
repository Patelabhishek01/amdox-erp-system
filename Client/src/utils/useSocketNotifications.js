import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken, getUser } from "./auth";

// Audio chime using Web Audio API (Synthesized so no external assets are required)
export const playNotificationChime = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play double chime (D5 -> A5)
    const playTone = (freq, start, duration) => {
      const osc  = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    const now = audioCtx.currentTime;
    playTone(587.33, now,       0.15); // D5
    playTone(880.00, now + 0.1, 0.25); // A5
  } catch (err) {
    console.warn("Audio Context blocked or unsupported:", err);
  }
};

let socket = null; // Global socket reference to avoid multiple connections

export default function useSocketNotifications() {
  const [notifications, setNotifications] = useState([]);

  const token  = getToken();
  const user   = getUser();
  const userId = user?.id || user?._id;
  const department = user?.department;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const baseUrl = API_URL.replace("/api", ""); // Strip api endpoint if present

  // ─── Compute unread count from state ─────────────────────────────────────
  const unreadCount = notifications.filter((n) => {
    if (!n.userId && !n.department) {
      // Broadcast: unread if userId NOT in readBy array
      return !n.readBy?.includes(userId);
    }
    return !n.isRead;
  }).length;

  // ─── Fetch initial notifications ──────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Deduplicate by _id to avoid duplicate items in state
          const unique = [];
          const seen = new Set();
          for (const item of data) {
            const id = String(item._id);
            if (!seen.has(id)) {
              seen.add(id);
              unique.push(item);
            }
          }
          setNotifications(unique);
        }
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, [token, API_URL]);

  // ─── Mark single as read (optimistic update) ──────────────────────────────
  const markAsRead = async (id) => {
    if (!token) return;

    // Optimistic: update local state immediately so UI responds instantly
    setNotifications((prev) =>
      prev.map((n) => {
        if (n._id !== id) return n;
        if (!n.userId && !n.department) {
          // Broadcast: push userId into readBy
          const alreadyRead = n.readBy?.includes(userId);
          return alreadyRead ? n : { ...n, readBy: [...(n.readBy || []), userId] };
        }
        return { ...n, isRead: true };
      })
    );

    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Error marking read:", err);
      fetchNotifications(); // Revert to server state on error
    }
  };

  // ─── Mark all as read (optimistic update) ─────────────────────────────────
  const markAllAsRead = async () => {
    if (!token) return;

    // Optimistic: mark everything read locally
    setNotifications((prev) =>
      prev.map((n) => {
        if (!n.userId && !n.department) {
          const alreadyRead = n.readBy?.includes(userId);
          return alreadyRead ? n : { ...n, readBy: [...(n.readBy || []), userId] };
        }
        return { ...n, isRead: true };
      })
    );

    try {
      await fetch(`${API_URL}/api/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Error marking all read:", err);
      fetchNotifications(); // Revert on error
    }
  };

  // ─── Delete notification (optimistic update) ──────────────────────────────
  const deleteNotification = async (id) => {
    if (!token) return;

    // Optimistic: remove from local state immediately
    setNotifications((prev) => prev.filter((n) => n._id !== id));

    try {
      await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
      fetchNotifications(); // Revert on error
    }
  };

  // ─── Setup Socket connection & listeners ──────────────────────────────────
  useEffect(() => {
    if (!token || !userId) return;

    // Connect to Socket.IO server once
    if (!socket) {
      socket = io(baseUrl, {
        transports: ["websocket", "polling"]
      });
    }

    // Register user details to channels
    socket.emit("register", userId);
    if (department) {
      socket.emit("joinDepartment", department);
    }

    // Register listeners with strict deduplication check inside setter
    const handleNewNotification = (notification) => {
      if (!notification || !notification._id) return;

      setNotifications((prev) => {
        const notifId = String(notification._id);
        const alreadyExists = prev.some((n) => String(n._id) === notifId);
        
        // If already in list, discard duplicate event without triggering audio or push notif!
        if (alreadyExists) return prev;

        // Trigger Audio Chime ONLY ONCE for unique new notifications
        playNotificationChime();

        // Trigger Browser Push Notification ONLY ONCE for unique new notifications
        if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
          try {
            new Notification(notification.title || "Notification", {
              body: notification.message || "",
              icon: "/logo.png"
            });
          } catch (err) {
            console.warn("Browser push error:", err);
          }
        }

        return [notification, ...prev];
      });
    };

    // Remove existing listener before binding to prevent listener accumulation
    socket.off("notification", handleNewNotification);
    socket.on("notification", handleNewNotification);

    // Initial fetch
    fetchNotifications();

    // Ask browser notification permissions
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      if (socket) {
        socket.off("notification", handleNewNotification);
      }
    };
  }, [token, userId, department, baseUrl, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  };
}
