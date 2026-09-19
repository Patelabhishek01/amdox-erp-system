import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTachometerAlt,
  FaUsers,
  FaWallet,
  FaBoxes,
  FaShoppingCart,
  FaTruck,
  FaHandshake,
  FaTasks,
  FaLifeRing,
  FaLaptop,
  FaUserPlus,
  FaUserShield,
  FaUserCog,
} from "react-icons/fa";

// ─── Role-based access configuration ─────────────────────────────────────────
const MODULE_ROLES = {
  "/dashboard":          ["super admin", "admin", "hr manager", "hr executive", "finance manager", "accountant", "inventory manager", "store keeper", "sales manager", "sales executive", "purchase manager", "crm manager", "project manager", "help desk agent", "asset manager", "recruiter", "employee"],
  "/admin":              ["super admin", "admin"],
  "/users":              ["super admin", "admin"],
  "/ess-dashboard":      ["super admin", "admin", "employee"],
  "/employees":          ["super admin", "admin", "hr manager", "hr executive"],
  "/project":            ["super admin", "admin", "project manager"],
  "/finance/expenses":   ["super admin", "admin", "finance manager", "accountant"],
  "/inventory/products": ["super admin", "admin", "inventory manager", "store keeper"],
  "/sales/customers":    ["super admin", "admin", "sales manager", "sales executive", "crm manager"],
  "/purchase":           ["super admin", "admin", "purchase manager"],
  "/crm":                ["super admin", "admin", "crm manager", "sales manager"],
  "/helpdesk":           ["super admin", "admin", "help desk agent"],
  "/asset":              ["super admin", "admin", "asset manager"],
  "/recruitment":        ["super admin", "admin", "recruiter", "hr manager"],
};

// ─── Main Section Items ────────────────────────────────────────────────────────
const MAIN_MODULES = [
  { name: "Dashboard",    path: "/dashboard",     icon: <FaTachometerAlt /> },
  { name: "My Workspace", path: "/ess-dashboard", icon: <FaTachometerAlt /> },
  { name: "Admin Panel",  path: "/admin",         icon: <FaUserShield /> },
  { name: "Users",        path: "/users",         icon: <FaUserCog /> },
];

// ─── Implemented Modules ───────────────────────────────────────────────────────
const IMPLEMENTED_MODULES = [
  { name: "HR",                 path: "/employees", icon: <FaUsers /> },
  { name: "Project Management", path: "/project",   icon: <FaTasks /> },
];

// ─── Coming Soon Modules ───────────────────────────────────────────────────────
const COMING_SOON_MODULES = [
  { name: "Finance",          path: "/finance/expenses",   icon: <FaWallet /> },
  { name: "Inventory",        path: "/inventory/products", icon: <FaBoxes /> },
  { name: "Sales",            path: "/sales/customers",    icon: <FaShoppingCart /> },
  { name: "Purchase",         path: "/purchase",           icon: <FaTruck /> },
  { name: "CRM",              path: "/crm",                icon: <FaHandshake /> },
  { name: "Help Desk",        path: "/helpdesk",           icon: <FaLifeRing /> },
  { name: "Asset Management", path: "/asset",              icon: <FaLaptop /> },
  { name: "Recruitment",      path: "/recruitment",        icon: <FaUserPlus /> },
];

// ─── NavItem for fully functional items ──────────────────────────────────────
function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
      title={collapsed ? item.name : undefined}
    >
      <span className="sidebar-icon">{item.icon}</span>
      {!collapsed && <span>{item.name}</span>}
    </NavLink>
  );
}

// ─── ComingSoonItem for incomplete modules ────────────────────────────────────
function ComingSoonItem({ item, collapsed }) {
  return (
    <div
      className="sidebar-link coming-soon"
      onClick={(e) => e.preventDefault()}
      title={collapsed ? `${item.name} (Coming Soon)` : undefined}
    >
      <span className="sidebar-icon">{item.icon}</span>
      {!collapsed && (
        <>
          <span>{item.name}</span>
          <span className="coming-soon-badge">Soon</span>
        </>
      )}
    </div>
  );
}

// ─── SidebarSection ────────────────────────────────────────────────────────────
function SidebarSection({ title, items, collapsed, isComingSoon = false }) {
  if (!items || items.length === 0) return null;

  return (
    <>
      {!collapsed && (
        <div className="sidebar-section-title">{title}</div>
      )}
      {items.map((item) =>
        isComingSoon ? (
          <ComingSoonItem key={item.path} item={item} collapsed={collapsed} />
        ) : (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        )
      )}
    </>
  );
}

// ─── Main Sidebar Component ───────────────────────────────────────────────────
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Get role from localStorage (fallback to employee)
  const role = (localStorage.getItem("role") || "employee").toLowerCase();

  // Filter main & implemented items by user role (super admin & admin see all)
  const isSuperOrAdmin = role === "super admin" || role === "admin";

  const visibleMain = MAIN_MODULES.filter(
    (item) => isSuperOrAdmin || MODULE_ROLES[item.path]?.includes(role)
  );

  const visibleImplemented = IMPLEMENTED_MODULES.filter(
    (item) => isSuperOrAdmin || MODULE_ROLES[item.path]?.includes(role)
  );

  const visibleComingSoon = COMING_SOON_MODULES.filter(
    (item) => isSuperOrAdmin || MODULE_ROLES[item.path]?.includes(role)
  );

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        {!collapsed ? (
          <div className="sidebar-brand">
            <div className="sidebar-logo">A</div>
            <div>
              <h2>Amdox ERP</h2>
              <p>Enterprise Suite</p>
            </div>
          </div>
        ) : (
          <div className="sidebar-logo center">A</div>
        )}
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main Section (Dashboard, etc.) */}
        <SidebarSection
          title="Main"
          items={visibleMain}
          collapsed={collapsed}
        />

        {/* Implemented Section */}
        <SidebarSection
          title="Implemented"
          items={visibleImplemented}
          collapsed={collapsed}
        />

        {/* Coming Soon Section */}
        <SidebarSection
          title="Coming Soon"
          items={visibleComingSoon}
          collapsed={collapsed}
          isComingSoon={true}
        />
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar-footer">
          <p>Version 1.0.0</p>
        </div>
      )}
    </aside>
  );
}