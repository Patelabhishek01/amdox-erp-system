import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavBar from "./TopNavBar";
import CommandPalette from "./CommandPalette";

// Dynamic Page Titles Config
const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/employees": "HR Management",
  "/attendance": "Attendance",
  "/leaves": "Leave Management",
  "/payroll": "Payroll",
  "/finance/expenses": "Finance",
  "/inventory/products": "Inventory",
  "/sales/customers": "Sales",
  "/purchase": "Purchase",
  "/crm": "CRM",
  "/project": "Project Management",
  "/helpdesk": "Help Desk",
  "/asset": "Asset Management",
  "/recruitment": "Recruitment",
  "/profile": "My Profile",
  "/settings": "Settings",
  "/ai-assistant": "AI Assistant",
  "/hr-dashboard": "HR Dashboard",
  "/inventory-dashboard": "Inventory Dashboard",
  "/sales-dashboard": "Sales Dashboard",
  "/purchase-dashboard": "Purchase Dashboard",
  "/crm-dashboard": "CRM Dashboard",
  "/project-dashboard": "Project Dashboard",
  "/helpdesk-dashboard": "Help Desk Dashboard",
  "/asset-dashboard": "Asset Dashboard",
  "/recruitment-dashboard": "Recruitment Dashboard",
};

// Dynamic Breadcrumbs Sub-component
function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0 || location.pathname === "/dashboard") return null;

  return (
    <div className="breadcrumbs">
      <Link to="/dashboard">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        
        // Clean display name
        let displayName = value.charAt(0).toUpperCase() + value.slice(1);
        displayName = displayName.replace("-", " ");
        if (displayName === "Crm") displayName = "CRM";
        if (displayName === "Hr dashboard") displayName = "HR Dashboard";

        return (
          <span key={to}>
            {" / "}
            {isLast ? (
              <span style={{ color: "var(--primary-color)", fontWeight: "600" }}>{displayName}</span>
            ) : (
              <Link to={to}>{displayName}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function MainLayout({ children }) {
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname]);

  // Command Palette listener (Ctrl + K)
  useEffect(() => {
    const handleCtrlK = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleCtrlK);
    return () => window.removeEventListener("keydown", handleCtrlK);
  }, []);

  // Theme Sync on Mount
  useEffect(() => {
    const saved = localStorage.getItem("erp-settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Apply theme attribute
      if (parsed.theme) {
        document.documentElement.setAttribute("data-theme", parsed.theme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }

      // Apply dark-mode class
      if (parsed.darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    }
  }, []);

  const currentTitle = PAGE_TITLES[location.pathname] || "ERP System";

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={closeMobileSidebar}></div>
          <div className="mobile-sidebar">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="main-content-wrapper">
        {/* Top Navbar */}
        <TopNavBar
          title={currentTitle}
          toggleSidebar={toggleMobileSidebar}
        />

        {/* Page Content */}
        <main className="page-content">
          <Breadcrumbs />
          {children}
        </main>
      </div>

      {/* Ctrl + K Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}