import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavBar from "./TopNavBar";

// ─────────────────────────────────────────────
// Dynamic Page Titles
// ─────────────────────────────────────────────
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

  "/inventory-dashboard":
    "Inventory Dashboard",

  "/sales-dashboard":
    "Sales Dashboard",

  "/purchase-dashboard":
    "Purchase Dashboard",

  "/crm-dashboard":
    "CRM Dashboard",

  "/project-dashboard":
    "Project Dashboard",

  "/helpdesk-dashboard":
    "Help Desk Dashboard",

  "/asset-dashboard":
    "Asset Dashboard",

  "/recruitment-dashboard":
    "Recruitment Dashboard",
};

export default function MainLayout({
  children,
}) {
  const location = useLocation();

  // ─────────────────────────────────────────
  // Mobile Sidebar
  // ─────────────────────────────────────────
  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(
      !mobileSidebarOpen
    );
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  // ─────────────────────────────────────────
  // Close sidebar on route change
  // ─────────────────────────────────────────
  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname]);

  // ─────────────────────────────────────────
  // Dynamic Title
  // ─────────────────────────────────────────
  const currentTitle =
    PAGE_TITLES[location.pathname] ||
    "ERP System";

  return (
    <div className="app-layout">

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <>
          <div
            className="sidebar-overlay"
            onClick={
              closeMobileSidebar
            }
          ></div>

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
          toggleSidebar={
            toggleMobileSidebar
          }
        />

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>

      </div>
    </div>
  );
}