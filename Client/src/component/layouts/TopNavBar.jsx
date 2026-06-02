import { useEffect, useRef, useState } from "react";
import { Bell, Bot, Menu, Search, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

// ─── All modules with role access ─────────────────────────────────────────────
const ALL_MODULES = [
  { name: "Dashboard",          path: "/dashboard",          roles: ["admin", "hr", "finance", "inventory", "sales", "purchase", "crm", "project", "helpdesk", "asset", "employee"] },
  { name: "HR Management",      path: "/employees",          roles: ["admin", "hr"] },
  { name: "Attendance",         path: "/attendance",         roles: ["admin", "hr", "employee"] },
  { name: "Leave Management",   path: "/leaves",             roles: ["admin", "hr", "employee"] },
  { name: "Payroll",            path: "/payroll",            roles: ["admin", "hr"] },
  { name: "Finance / Expenses", path: "/finance/expenses",   roles: ["admin", "finance"] },
  { name: "Inventory",          path: "/inventory/products", roles: ["admin", "inventory"] },
  { name: "Sales",              path: "/sales/customers",    roles: ["admin", "sales", "crm"] },
  { name: "Purchase",           path: "/purchase",           roles: ["admin", "purchase"] },
  { name: "CRM",                path: "/crm",                roles: ["admin", "crm", "sales"] },
  { name: "Projects",           path: "/project",            roles: ["admin", "project"] },
  { name: "Help Desk",          path: "/helpdesk",           roles: ["admin", "helpdesk", "employee"] },
  { name: "Assets",             path: "/asset",              roles: ["admin", "asset"] },
  { name: "Recruitment",        path: "/recruitment",        roles: ["admin", "hr"] },
  { name: "Users",              path: "/users",              roles: ["admin"] },
  { name: "Reports",            path: "/reports",            roles: ["admin", "finance"] },
  { name: "Settings",           path: "/settings",           roles: ["admin", "hr", "finance", "inventory", "sales", "purchase", "crm", "project", "helpdesk", "asset", "employee"] },
  { name: "Profile",            path: "/profile",            roles: ["admin", "hr", "finance", "inventory", "sales", "purchase", "crm", "project", "helpdesk", "asset", "employee"] },
  { name: "AI Assistant",       path: "/ai-assistant",       roles: ["admin", "hr", "finance", "inventory", "sales", "purchase", "crm", "project", "helpdesk", "asset", "employee"] },
];

// ─── Role display config ───────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin:     { label: "Administrator",       color: "#2563eb" },
  hr:        { label: "HR Manager",          color: "#16a34a" },
  finance:   { label: "Finance",             color: "#d97706" },
  inventory: { label: "Inventory Manager",   color: "#7c3aed" },
  sales:     { label: "Sales",               color: "#db2777" },
  purchase:  { label: "Purchase Manager",    color: "#0891b2" },
  crm:       { label: "CRM Manager",         color: "#ea580c" },
  project:   { label: "Project Manager",     color: "#4f46e5" },
  helpdesk:  { label: "Help Desk",           color: "#0f766e" },
  asset:     { label: "Asset Manager",       color: "#b45309" },
  employee:  { label: "Employee",            color: "#64748b" },
};

export default function TopNavbar({ toggleSidebar, title }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [search, setSearch]                   = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile]         = useState(false);

  const searchRef      = useRef(null);
  const notificationRef = useRef(null);
  const profileRef     = useRef(null);

  // ─── Read role from localStorage ──────────────────────────────────────────
  const role       = localStorage.getItem("role") || "employee";
  const roleConfig = ROLE_CONFIG[role] || { label: role, color: "#64748b" };

  // Build avatar URL using role label
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(roleConfig.label)}&background=${roleConfig.color.replace("#", "")}&color=fff`;

  // ─── Filter search modules by role ────────────────────────────────────────
  const filteredModules = ALL_MODULES.filter(
    (m) =>
      m.roles.includes(role) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  // ─── Close dropdowns on outside click ─────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearchResults(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ─── Close on route change ─────────────────────────────────────────────────
  useEffect(() => {
    setShowSearchResults(false);
    setShowNotifications(false);
    setShowProfile(false);
  }, [location.pathname]);

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearch("");
    setShowSearchResults(false);
  };

  return (
    <header className="top-navbar">

      {/* ── Left Section ── */}
      <div className="top-navbar-left">

        <button className="icon-btn mobile-only" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>

        {title && (
          <span
            className="desktop-only"
            style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap" }}
          >
            {title}
          </span>
        )}

        {/* Search — only shows role-allowed modules */}
        <div className="global-search" ref={searchRef}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSearchResults(e.target.value.trim() !== "");
            }}
            onFocus={() => {
              if (search.trim() !== "") setShowSearchResults(true);
            }}
          />
          {showSearchResults && (
            <div className="search-dropdown">
              {filteredModules.length > 0 ? (
                filteredModules.map((module, index) => (
                  <div
                    key={index}
                    className="search-item"
                    onClick={() => handleSearchSelect(module.path)}
                  >
                    {module.name}
                  </div>
                ))
              ) : (
                <div className="search-empty">No modules found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Section ── */}
      <div className="top-navbar-right">

        {/* Notifications */}
        <div className="dropdown-wrapper" ref={notificationRef}>
          <button
            className="icon-btn"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfile(false);
            }}
          >
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          {showNotifications && <NotificationDropdown />}
        </div>

        {/* Settings */}
        <button className="icon-btn" onClick={() => navigate("/settings")}>
          <Settings size={20} />
        </button>

        {/* AI Assistant */}
        <button className="ai-btn" onClick={() => navigate("/ai-assistant")}>
          <Bot size={18} />
          <span className="desktop-only">AI Assistant</span>
        </button>

        {/* Profile — now shows real role name and color */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <button
            className="profile-btn"
            onClick={() => {
              setShowProfile((prev) => !prev);
              setShowNotifications(false);
            }}
          >
            <img src={avatarUrl} alt="Profile" />
            <div className="profile-info desktop-only">
              <span className="profile-name">{roleConfig.label}</span>
              {/* Role badge with role-specific color */}
              <span
                className="profile-role"
                style={{
                  background: roleConfig.color + "20",  /* 20 = 12% opacity */
                  color: roleConfig.color,
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {role}
              </span>
            </div>
          </button>
          {showProfile && <ProfileDropdown />}
        </div>

      </div>
    </header>
  );
}