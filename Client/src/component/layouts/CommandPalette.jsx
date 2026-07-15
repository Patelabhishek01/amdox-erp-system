import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Compass, Sun, Moon, Database, HelpCircle, X, ShieldAlert } from "lucide-react";

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalRef = useRef(null);

  const role = localStorage.getItem("role") || "employee";

  // List of command options
  const commands = [
    { name: "Go to Dashboard", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/dashboard") },
    { name: "Go to HR Management", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/employees"), roles: ["admin", "hr"] },
    { name: "Go to Attendance", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/attendance") },
    { name: "Go to Leave Management", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/leaves") },
    { name: "Go to Payroll", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/payroll"), roles: ["admin", "hr"] },
    { name: "Go to Finance / Expenses", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/finance/expenses"), roles: ["admin", "finance"] },
    { name: "Go to Inventory Products", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/inventory/products"), roles: ["admin", "inventory"] },
    { name: "Go to Sales Customers", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/sales/customers"), roles: ["admin", "sales", "crm"] },
    { name: "Go to Purchase Orders", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/purchase"), roles: ["admin", "purchase"] },
    { name: "Go to CRM Leads", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/crm"), roles: ["admin", "crm", "sales"] },
    { name: "Go to Project Management", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/project") },
    { name: "Go to Help Desk Tickets", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/helpdesk") },
    { name: "Go to Asset Management", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/asset"), roles: ["admin", "asset"] },
    { name: "Go to Recruitment", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/recruitment"), roles: ["admin", "hr"] },
    { name: "Go to My Profile", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/profile") },
    { name: "Go to Settings", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/settings") },
    { name: "Go to AI Assistant", category: "Navigation", icon: <Compass size={18} />, action: () => navigate("/ai-assistant") },
    { name: "Go to Admin Panel", category: "Navigation", icon: <ShieldAlert size={18} />, action: () => navigate("/admin"), roles: ["admin"] },
    
    // Quick Actions
    { name: "Toggle Theme (Light / Dark)", category: "System", icon: <Sun size={18} />, action: () => toggleTheme() },
    { name: "Download DB Backup JSON", category: "System", icon: <Database size={18} />, action: () => downloadBackup(), roles: ["admin"] },
    { name: "Configure AI Assistant Provider", category: "System", icon: <Database size={18} />, action: () => navigate("/settings#ai"), roles: ["admin"] }
  ];

  // Helper: toggle dark/light theme
  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark-mode");
    const saved = localStorage.getItem("erp-settings");
    const settings = saved ? JSON.parse(saved) : {};
    settings.darkMode = isDark;
    localStorage.setItem("erp-settings", JSON.stringify(settings));
    alert(`Theme toggled to ${isDark ? "Dark" : "Light"} mode!`);
    onClose();
  };

  // Helper: trigger DB backup download
  const downloadBackup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/settings/backup", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Backup failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `amdox-erp-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      alert("Database backup download complete ✅");
      onClose();
    } catch (err) {
      alert("Error generating database backup: " + err.message);
    }
  };

  // Filter commands by search & user role
  const filtered = commands.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(search.toLowerCase()) || 
                          cmd.category.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !cmd.roles || cmd.roles.includes(role);
    return matchesSearch && matchesRole;
  });

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  // Key navigation handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  // Reset search and selection on open
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "100px",
        zIndex: 9999
      }}
    >
      <div
        ref={modalRef}
        className="card glass-effect"
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "450px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
        }}
      >
        {/* Search header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            borderBottom: "1px solid var(--border-color)",
            gap: "12px"
          }}
        >
          <Search size={20} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Type a command or module name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: "16px",
              color: "var(--text-main)",
              outline: "none",
              padding: 0
            }}
            autoFocus
          />
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderRadius: "4px"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Command list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const isActive = idx === selectedIndex;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: isActive ? "var(--primary-color)" : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-main)",
                    transition: "background 0.15s, color 0.15s"
                  }}
                >
                  <span style={{ color: isActive ? "#ffffff" : "var(--text-muted)" }}>
                    {cmd.icon}
                  </span>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>{cmd.name}</span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: isActive ? "rgba(255,255,255,0.2)" : "var(--border-color)",
                        color: isActive ? "#ffffff" : "var(--text-muted)"
                      }}
                    >
                      {cmd.category}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "24px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <HelpCircle size={32} />
              <span>No results found matching your search.</span>
            </div>
          )}
        </div>

        {/* Palette Footer hint */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid var(--border-color)",
            fontSize: "11px",
            color: "var(--text-muted)",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, and <kbd>Enter</kbd> to execute.</span>
          <span>Press <kbd>Esc</kbd> to close.</span>
        </div>
      </div>
    </div>
  );
}
