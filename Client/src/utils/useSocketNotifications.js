import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { getToken, getUser } from "./auth";

// Audio chime using Web Audio API (Synthesized so no external assets are required)
export const playNotificationChime = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play double chime (D5 -> A5)
    const playTone = (freq, start, duration) => {
      const osc = audioCtx.createOscillator();
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
    playTone(587.33, now, 0.15); // D5
    playTone(880.00, now + 0.1, 0.25); // A5
  } catch (err) {
    console.warn("Audio Context blocked or unsupported:", err);
  }
};

let socket = null; // Global socket reference to avoid multiple connections

export default function useSocketNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = getToken();
  const user = getUser();
  const userId = user?.id;
  const department = user?.department;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const baseUrl = API_URL.replace("/api", ""); // Strip api endpoint if present

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        
        // Count unread
        const unread = data.filter(n => {
          if (!n.userId && !n.department) {
            // Broadcasts: check if user id is NOT in readBy
            return !n.readBy.includes(userId);
          }
          return !n.isRead;
        }).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, [token, userId, API_URL]);

  // Mark single as read
  const markAsRead = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Setup Socket connection & listeners
  useEffect(() => {
    if (!token || !userId) return;

    // Connect to Socket.IO server
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

    // Register listeners
    const handleNewNotification = (notification) => {
      // Append new notification
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Play synthesized tone
      playNotificationChime();

      // Show Browser push notification if allowed
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/logo.png"
        });
      }
    };

    socket.on("notification", handleNewNotification);

    // Initial fetch
    fetchNotifications();

    // Ask browser notification permissions
    if (Notification.permission === "default") {
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
