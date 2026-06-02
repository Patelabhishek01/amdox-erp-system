// import { LogOut, Settings, User } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function ProfileDropdown() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear authentication and user data
//     localStorage.clear();

//     // Redirect to login page
//     navigate("/");
//   };

//   return (
//     <div className="top-dropdown profile-dropdown">
//       <div className="dropdown-user-info">
//         <img
//           src="https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff"
//           alt="Profile"
//         />
//         <div>
//           <h4>Admin User</h4>
//           <p>admin@erp.com</p>
//         </div>
//       </div>

//       <div className="dropdown-divider"></div>

//       <button
//         className="dropdown-action"
//         onClick={() => navigate("/profile")}
//       >
//         <User size={16} />
//         <span>My Profile</span>
//       </button>

//       <button
//         className="dropdown-action"
//         onClick={() => navigate("/settings")}
//       >
//         <Settings size={16} />
//         <span>Settings</span>
//       </button>

//       <div className="dropdown-divider"></div>

//       <button
//         className="dropdown-action logout"
//         onClick={handleLogout}
//       >
//         <LogOut size={16} />
//         <span>Logout</span>
//       </button>
//     </div>
//   );
// }


import {
  LogOut,
  Settings,
  User,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

// ─── Role config ─────────────────────────────────────────────
const ROLE_CONFIG = {
  admin:     { label: "Administrator",     color: "#2563eb" },
  hr:        { label: "HR Manager",        color: "#16a34a" },
  finance:   { label: "Finance",           color: "#d97706" },
  inventory: { label: "Inventory Manager", color: "#7c3aed" },
  sales:     { label: "Sales",             color: "#db2777" },
  purchase:  { label: "Purchase Manager",  color: "#0891b2" },
  crm:       { label: "CRM Manager",       color: "#ea580c" },
  project:   { label: "Project Manager",   color: "#4f46e5" },
  helpdesk:  { label: "Help Desk",         color: "#0f766e" },
  asset:     { label: "Asset Manager",     color: "#b45309" },
  employee:  { label: "Employee",          color: "#64748b" },
};

export default function ProfileDropdown() {
  const navigate = useNavigate();

  // Get role from localStorage
  const role = localStorage.getItem("role") || "employee";

  const roleConfig =
    ROLE_CONFIG[role] || {
      label: role,
      color: "#64748b",
    };

  // Dynamic avatar
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    roleConfig.label
  )}&background=${roleConfig.color.replace(
    "#",
    ""
  )}&color=fff`;

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="top-dropdown profile-dropdown">
      {/* User Info */}
      <div className="dropdown-user-info">
        <img src={avatarUrl} alt="Profile" />

        <div>
          <h4>{roleConfig.label}</h4>

          <p
            style={{
              display: "inline-block",
              marginTop: "4px",
              background: roleConfig.color + "20",
              color: roleConfig.color,
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {role}
          </p>
        </div>
      </div>

      <div className="dropdown-divider"></div>

      {/* Profile */}
      <button
        className="dropdown-action"
        onClick={() => navigate("/profile")}
      >
        <User size={16} />
        <span>My Profile</span>
      </button>

      {/* Settings */}
      <button
        className="dropdown-action"
        onClick={() => navigate("/settings")}
      >
        <Settings size={16} />
        <span>Settings</span>
      </button>

      {/* Admin only */}
      {role === "admin" && (
        <button
          className="dropdown-action"
          onClick={() => navigate("/users")}
        >
          <ShieldCheck size={16} />
          <span>User Management</span>
        </button>
      )}

      <div className="dropdown-divider"></div>

      {/* Logout */}
      <button
        className="dropdown-action logout"
        onClick={handleLogout}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}