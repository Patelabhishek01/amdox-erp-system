import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocketNotifications from "../../utils/useSocketNotifications";
import {
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Info,
  ShieldAlert,
  CheckCircle,
  Bell,
} from "lucide-react";

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useSocketNotifications();

  const [showAll, setShowAll] = useState(false);

  // ── Helper: is a notification unread for the current user? ─────────────
  const getCurrentUserId = () =>
    JSON.parse(localStorage.getItem("user") || "{}")?.id || "";

  const isUnread = (item) => {
    if (!item.userId && !item.department) {
      // Broadcast: unread if userId NOT in readBy
      return !item.readBy?.includes(getCurrentUserId());
    }
    return !item.isRead;
  };

  // ── Visible list based on toggle ──────────────────────────────────────
  const unreadList = notifications.filter(isUnread);
  const visibleList = showAll ? notifications : unreadList;
  const unreadCount = unreadList.length;

  // ── Icon by type ───────────────────────────────────────────────────────
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={15} style={{ color: "#16a34a" }} />;
      case "warning":
        return <AlertTriangle size={15} style={{ color: "#d97706" }} />;
      case "error":
        return <ShieldAlert size={15} style={{ color: "#dc2626" }} />;
      default:
        return <Info size={15} style={{ color: "#2563eb" }} />;
    }
  };

  // ── Navigate on notification click ────────────────────────────────────
  const handleClick = (item) => {
    markAsRead(item._id);
    const t = item.title?.toLowerCase() || "";
    if (t.includes("leave")) navigate("/leaves");
    else if (t.includes("product") || t.includes("stock")) navigate("/inventory/products");
    else if (t.includes("ticket")) navigate("/helpdesk");
    else if (t.includes("expense")) navigate("/finance/expenses");
    else if (t.includes("project")) navigate("/project");
    else navigate("/dashboard");
  };

  // ── Time ago helper ───────────────────────────────────────────────────
  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
    return `${Math.floor(s / 2592000)}mo ago`;
  };

  return (
    /*
     * IMPORTANT: Do NOT add glass-effect or backdrop-filter here.
     * The .top-dropdown class provides the correct opaque white background,
     * border, border-radius, box-shadow, and z-index (9200).
     * Adding glass-effect would make it semi-transparent again.
     */
    <div className="top-dropdown notification-dropdown">

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="dropdown-header">
        {/* Title + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Bell size={16} style={{ color: "#2563eb", flexShrink: 0 }} />
          <span style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "18px",
                height: "18px",
                padding: "0 5px",
                background: "#dc2626",
                color: "#fff",
                fontSize: "10px",
                fontWeight: "700",
                borderRadius: "9px",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {/* Header controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={() => setShowAll((p) => !p)}
            style={{
              background: "transparent",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: "11px",
              fontWeight: "500",
              padding: "3px 8px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.color = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            {showAll ? "Unread only" : "Show all"}
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: "transparent",
                border: "1px solid #dbeafe",
                cursor: "pointer",
                color: "#2563eb",
                fontSize: "11px",
                fontWeight: "600",
                padding: "3px 8px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <CheckCheck size={12} />
              All read
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Body ────────────────────────────────────────────── */}
      <div className="dropdown-body">
        {visibleList.length > 0 ? (
          visibleList.map((item) => {
            const unread = isUnread(item);
            return (
              <div
                key={item._id}
                className={`notification-item${unread ? " unread" : ""}`}
                onClick={() => handleClick(item)}
              >
                {/* Icon */}
                <div className="notification-icon-col">
                  {getIcon(item.type)}
                </div>

                {/* Text content */}
                <div className="notification-content">
                  <h5>{item.title}</h5>
                  <p>{item.message}</p>
                  <small>{timeAgo(item.createdAt)}</small>
                </div>

                {/* Action buttons */}
                <div className="notification-actions">
                  {unread && (
                    <button
                      className="notification-action-btn mark-read"
                      title="Mark as read"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(item._id);
                      }}
                    >
                      <Check size={13} />
                    </button>
                  )}
                  <button
                    className="notification-action-btn delete"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item._id);
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "32px 20px",
              color: "#9ca3af",
            }}
          >
            <CheckCircle
              size={28}
              style={{ color: "#d1fae5", marginBottom: "8px" }}
            />
            <p style={{ margin: 0, fontSize: "13px" }}>
              {showAll ? "No notifications." : "You're all caught up! 🎉"}
            </p>
          </div>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="dropdown-footer">
        <span style={{ fontSize: "11px", color: "#9ca3af" }}>
          {notifications.length} total &nbsp;·&nbsp; {unreadCount} unread
        </span>
      </div>
    </div>
  );
}