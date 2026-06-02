import { useNavigate } from "react-router-dom";

export default function NotificationDropdown() {
  const navigate = useNavigate();

  const notifications = [
    {
      title: "New employee joined",
      message: "Rahul Sharma was added to HR.",
      time: "2 min ago",
      path: "/hr",
    },
    {
      title: "Purchase order approved",
      message: "PO-2026-014 has been approved.",
      time: "10 min ago",
      path: "/purchase",
    },
    {
      title: "Leave request pending",
      message: "2 leave requests require approval.",
      time: "30 min ago",
      path: "/hr/leave",
    },
    {
      title: "Low stock alert",
      message: "Laptop inventory is below threshold.",
      time: "1 hour ago",
      path: "/inventory",
    },
  ];

  const handleNotificationClick = (path) => {
    navigate(path);
  };

  const handleViewAll = () => {
    navigate("/notifications");
  };

  return (
    <div className="top-dropdown notification-dropdown">
      <div className="dropdown-header">
        <h4>Notifications</h4>
        <span>{notifications.length} New</span>
      </div>

      <div className="dropdown-body">
        {notifications.map((item, index) => (
          <div
            key={index}
            className="notification-item"
            onClick={() =>
              handleNotificationClick(item.path)
            }
          >
            <div className="notification-content">
              <h5>{item.title}</h5>
              <p>{item.message}</p>
              <small>{item.time}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="dropdown-footer">
        <button onClick={handleViewAll}>
          View All Notifications
        </button>
      </div>
    </div>
  );
}