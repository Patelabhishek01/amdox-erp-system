import { useNavigate } from "react-router-dom";
import useSocketNotifications from "../../utils/useSocketNotifications";
import { Check, CheckCheck, Trash2, AlertTriangle, Info, ShieldAlert, CheckCircle } from "lucide-react";

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useSocketNotifications();

  // Helper to resolve icon by notification priority type
  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle size={16} style={{ color: "#16a34a" }} />;
      case "warning": return <AlertTriangle size={16} style={{ color: "#d97706" }} />;
      case "error": return <ShieldAlert size={16} style={{ color: "#dc2626" }} />;
      default: return <Info size={16} style={{ color: "#2563eb" }} />;
    }
  };

  const handleNotificationClick = (item) => {
    markAsRead(item._id);
    // Route to corresponding module based on system context
    if (item.title.toLowerCase().includes("leave")) {
      navigate("/leaves");
    } else if (item.title.toLowerCase().includes("product") || item.title.toLowerCase().includes("stock")) {
      navigate("/inventory/products");
    } else if (item.title.toLowerCase().includes("ticket")) {
      navigate("/helpdesk");
    } else if (item.title.toLowerCase().includes("expense")) {
      navigate("/finance/expenses");
    } else {
      navigate("/dashboard");
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval}m ago`;
    return "just now";
  };

  return (
    <div className="top-dropdown notification-dropdown glass-effect" style={{ width: "360px" }}>
      <div className="dropdown-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>
        <h4 style={{ margin: 0 }}>Notifications</h4>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--primary-color)",
              fontSize: "12px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      <div className="dropdown-body" style={{ maxHeight: "300px", overflowY: "auto" }}>
        {notifications.length > 0 ? (
          notifications.map((item) => {
            const isRead = item.isRead;
            return (
              <div
                key={item._id}
                className="notification-item"
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border-color)",
                  background: isRead ? "transparent" : "var(--primary-light)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ marginTop: "2px" }}>{getIcon(item.type)}</div>
                
                <div style={{ flex: 1 }} onClick={() => handleNotificationClick(item)}>
                  <h5 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: isRead ? "500" : "600" }}>
                    {item.title}
                  </h5>
                  <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {item.message}
                  </p>
                  <small style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    {timeAgo(item.createdAt)}
                  </small>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                  {!isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(item._id);
                      }}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item._id);
                    }}
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                  >
                    <Trash2 size={14} style={{ hover: { color: "#dc2626" } }} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "14px" }}>
            No notifications found.
          </div>
        )}
      </div>

      <div className="dropdown-footer" style={{ textAlign: "center", padding: "10px 16px", borderTop: "1px solid var(--border-color)" }}>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Real-time ERP Notifications channel active
        </span>
      </div>
    </div>
  );
}