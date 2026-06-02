import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,
  FaTachometerAlt, FaUsers, FaWallet, FaBoxes, FaShoppingCart,
  FaTruck, FaHandshake, FaTasks, FaLifeRing, FaLaptop,
  FaUserPlus, FaChartBar,
} from "react-icons/fa";

// ─── Role-based config ─────────────────────────────────────────────────────────
const MODULE_ROLES = {
  "/dashboard":          ["admin", "hr", "finance", "inventory", "sales", "purchase", "crm", "project", "helpdesk", "asset", "employee"],
  "/employees":          ["admin", "hr"],
  "/finance/expenses":   ["admin", "finance"],
  "/inventory/products": ["admin", "inventory"],
  "/sales/customers":    ["admin", "sales", "crm"],
  "/purchase":           ["admin", "purchase"],
  "/crm":                ["admin", "crm", "sales"],
  "/project":            ["admin", "project"],
  "/helpdesk":           ["admin", "helpdesk", "employee"],
  "/asset":              ["admin", "asset"],
  "/recruitment":        ["admin", "hr"],
};

const DASHBOARD_ROLES = {
  "/hr-dashboard":            ["admin", "hr"],
  "/inventory-dashboard":     ["admin", "inventory"],
  "/sales-dashboard":         ["admin", "sales"],
  "/purchase-dashboard":      ["admin", "purchase"],
  "/crm-dashboard":           ["admin", "crm"],
  "/project-dashboard":       ["admin", "project"],
  "/helpdesk-dashboard":      ["admin", "helpdesk"],
  "/asset-dashboard":         ["admin", "asset"],
  "/recruitment-dashboard":   ["admin", "hr"],
};

// ─── All items ─────────────────────────────────────────────────────────────────
const ALL_MODULE_ITEMS = [
  { name: "HR",          path: "/employees",          icon: <FaUsers /> },
  { name: "Finance",     path: "/finance/expenses",   icon: <FaWallet /> },
  { name: "Inventory",   path: "/inventory/products", icon: <FaBoxes /> },
  { name: "Sales",       path: "/sales/customers",    icon: <FaShoppingCart /> },
  { name: "Purchase",    path: "/purchase",           icon: <FaTruck /> },
  { name: "CRM",         path: "/crm",                icon: <FaHandshake /> },
  { name: "Projects",    path: "/project",            icon: <FaTasks /> },
  { name: "Help Desk",   path: "/helpdesk",           icon: <FaLifeRing /> },
  { name: "Assets",      path: "/asset",              icon: <FaLaptop /> },
  { name: "Recruitment", path: "/recruitment",        icon: <FaUserPlus /> },
];

const ALL_DASHBOARD_ITEMS = [
  { name: "HR Dashboard",          path: "/hr-dashboard",          icon: <FaChartBar /> },
  { name: "Inventory Dashboard",   path: "/inventory-dashboard",   icon: <FaChartBar /> },
  { name: "Sales Dashboard",       path: "/sales-dashboard",       icon: <FaChartBar /> },
  { name: "Purchase Dashboard",    path: "/purchase-dashboard",    icon: <FaChartBar /> },
  { name: "CRM Dashboard",         path: "/crm-dashboard",         icon: <FaChartBar /> },
  { name: "Project Dashboard",     path: "/project-dashboard",     icon: <FaChartBar /> },
  { name: "Help Desk Dashboard",   path: "/helpdesk-dashboard",    icon: <FaChartBar /> },
  { name: "Asset Dashboard",       path: "/asset-dashboard",       icon: <FaChartBar /> },
  { name: "Recruitment Dashboard", path: "/recruitment-dashboard", icon: <FaChartBar /> },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
    >
      <span className="sidebar-icon">{item.icon}</span>
      {!collapsed && <span>{item.name}</span>}
    </NavLink>
  );
}

function SidebarSection({ title, items, collapsed }) {
  return (
    <>
      {!collapsed && items.length > 0 && (
        <div className="sidebar-section-title">{title}</div>
      )}
      {items.map((item) => (
        <NavItem key={item.path} item={item} collapsed={collapsed} />
      ))}
    </>
  );
}

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Get role from localStorage (set during login)
  const role = localStorage.getItem("role") || "";

  // Filter items based on role
  const visibleModules   = ALL_MODULE_ITEMS.filter(
    (item) => MODULE_ROLES[item.path]?.includes(role)
  );
  const visibleDashboards = ALL_DASHBOARD_ITEMS.filter(
    (item) => DASHBOARD_ROLES[item.path]?.includes(role)
  );

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* Header */}
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
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        {/* Main Dashboard — visible to all */}
        <SidebarSection
          title="Main"
          items={[{ name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> }]}
          collapsed={collapsed}
        />

        {/* Role-filtered Modules */}
        <SidebarSection
          title="Modules"
          items={visibleModules}
          collapsed={collapsed}
        />

        {/* Analytics — only show if user has at least one dashboard */}
        {visibleDashboards.length > 0 && (
          <>
            {!collapsed && (
              <div className="sidebar-section-title">Analytics</div>
            )}

            <button
              type="button"
              className={`sidebar-link analytics-toggle ${analyticsOpen ? "active" : ""}`}
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
            >
              <span className="sidebar-icon"><FaChartBar /></span>
              {!collapsed && (
                <>
                  <span>Analytics Dashboard</span>
                  <span style={{ marginLeft: "auto", fontSize: "12px" }}>
                    {analyticsOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </>
              )}
            </button>

            {analyticsOpen && (
              <div className="analytics-children">
                {visibleDashboards.map((item) => (
                  <NavItem key={item.path} item={item} collapsed={collapsed} />
                ))}
              </div>
            )}
          </>
        )}

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



// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaChevronDown,
//   FaChevronUp,
//   FaTachometerAlt,
//   FaUsers,
//   FaWallet,
//   FaBoxes,
//   FaShoppingCart,
//   FaTruck,
//   FaHandshake,
//   FaTasks,
//   FaLifeRing,
//   FaLaptop,
//   FaUserPlus,
//   FaGraduationCap,
//   FaChartBar,
// } from "react-icons/fa";

// const mainDashboard = {
//   name: "Dashboard",
//   path: "/dashboard",
//   icon: <FaTachometerAlt />,
// };

// const moduleItems = [
//   { name: "HR", path: "/employees", icon: <FaUsers /> },
//   { name: "Finance", path: "/finance/expenses", icon: <FaWallet /> },
//   { name: "Inventory", path: "/inventory/products", icon: <FaBoxes /> },
//   { name: "Sales", path: "/sales/customers", icon: <FaShoppingCart /> },
//   { name: "Purchase", path: "/purchase", icon: <FaTruck /> },
//   { name: "CRM", path: "/crm", icon: <FaHandshake /> },
//   { name: "Projects", path: "/project", icon: <FaTasks /> },
//   { name: "Help Desk", path: "/helpdesk", icon: <FaLifeRing /> },
//   { name: "Assets", path: "/asset", icon: <FaLaptop /> },
//   { name: "Recruitment", path: "/recruitment", icon: <FaUserPlus /> },
//   // { name: "Training", path: "/training", icon: <FaGraduationCap /> },
// ];

// const dashboardItems = [
//   { name: "HR Dashboard", path: "/hr-dashboard", icon: <FaChartBar /> },
//   {
//     name: "Inventory Dashboard",
//     path: "/inventory-dashboard",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Sales Dashboard",
//     path: "/sales-dashboard",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Purchase Dashboard",
//     path: "/purchase-dashboard",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "CRM Dashboard",
//     path: "/crm-dashboard",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Project Dashboard",
//     path: "/project-dashboard",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Help Desk Dashboard",
//     path: "/helpdesk-dashboard",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Asset Dashboard",
//     path: "/asset-dashboard",
//     icon: <FaChartBar />,
//   },
//   {
//     name: "Recruitment Dashboard",
//     path: "/recruitment-dashboard",
//     icon: <FaChartBar />,
//   },
// ];

// function NavItem({ item, collapsed }) {
//   return (
//     <NavLink
//       to={item.path}
//       className={({ isActive }) =>
//         `sidebar-link ${isActive ? "active" : ""}`
//       }
//     >
//       <span className="sidebar-icon">{item.icon}</span>
//       {!collapsed && <span>{item.name}</span>}
//     </NavLink>
//   );
// }

// function SidebarSection({ title, items, collapsed }) {
//   return (
//     <>
//       {!collapsed && (
//         <div className="sidebar-section-title">{title}</div>
//       )}

//       {items.map((item) => (
//         <NavItem
//           key={item.path}
//           item={item}
//           collapsed={collapsed}
//         />
//       ))}
//     </>
//   );
// }

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [analyticsOpen, setAnalyticsOpen] = useState(false);

//   return (
//     <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
//       {/* Header */}
//       <div className="sidebar-header">
//         {!collapsed ? (
//           <div className="sidebar-brand">
//             <div className="sidebar-logo">A</div>
//             <div>
//               <h2>Amdox ERP</h2>
//               <p>Enterprise Suite</p>
//             </div>
//           </div>
//         ) : (
//           <div className="sidebar-logo center">A</div>
//         )}

//         <button
//           type="button"
//           className="sidebar-toggle"
//           onClick={() => setCollapsed(!collapsed)}
//         >
//           {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="sidebar-nav">
//         {/* Main Dashboard - same as before */}
//         <SidebarSection
//           title="Main"
//           items={[mainDashboard]}
//           collapsed={collapsed}
//         />

//         {/* Modules */}
//         <SidebarSection
//           title="Modules"
//           items={moduleItems}
//           collapsed={collapsed}
//         />

//         {/* Analytics Dashboard Collapsible Section */}
//         {!collapsed && (
//           <div className="sidebar-section-title">Analytics</div>
//         )}

//         <button
//           type="button"
//           className={`sidebar-link analytics-toggle ${
//             analyticsOpen ? "active" : ""
//           }`}
//           onClick={() =>
//             setAnalyticsOpen(!analyticsOpen)
//           }
//         >
//           <span className="sidebar-icon">
//             <FaChartBar />
//           </span>

//           {!collapsed && (
//             <>
//               <span>Analytics Dashboard</span>
//               <span
//                 style={{
//                   marginLeft: "auto",
//                   fontSize: "12px",
//                 }}
//               >
//                 {analyticsOpen ? (
//                   <FaChevronUp />
//                 ) : (
//                   <FaChevronDown />
//                 )}
//               </span>
//             </>
//           )}
//         </button>

//         {/* Show child dashboards only when open */}
//         {analyticsOpen && (
//           <div className="analytics-children">
//             {dashboardItems.map((item) => (
//               <NavItem
//                 key={item.path}
//                 item={item}
//                 collapsed={collapsed}
//               />
//             ))}
//           </div>
//         )}
//       </nav>

//       {/* Footer */}
//       {!collapsed && (
//         <div className="sidebar-footer">
//           <p>Version 1.0.0</p>
//         </div>
//       )}
//     </aside>
//   );
// }