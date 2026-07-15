import { useEffect, useState } from "react";
import MainLayout from "../component/layouts/MainLayout";
import PageHeader from "../component/ui/PageHeader";
import { apiRequest } from "../utils/api";
import {
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  Save,
  Building2,
  Database,
  Brain,
  Upload,
  Lock,
  Loader2
} from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("general"); // 'general' | 'appearance' | 'security' | 'ai' | 'rbac' | 'backup'
  
  const [settings, setSettings] = useState({
    companyName: "Amdox ERP",
    email: "admin@erp.com",
    language: "English",
    timezone: "Asia/Kolkata",
    notifications: true,
    darkMode: false,
    twoFactorAuth: false,
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    llmProvider: "mock",
    llmApiKey: "",
    rolePermissions: {}
  });

  const [logs, setLogs] = useState([]);
  const role = localStorage.getItem("role") || "employee";

  // Fetch settings from DB
  useEffect(() => {
    fetchSettings();
    if (role === "admin") {
      fetchSecurityLogs();
    }
  }, [role]);

  const fetchSettings = async () => {
    try {
      const res = await apiRequest("/api/settings");
      if (res.ok) {
        const data = await res.json();
        // Fallback for rolePermissions map structure
        if (!data.rolePermissions) data.rolePermissions = {};
        setSettings(data);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityLogs = async () => {
    try {
      const res = await apiRequest("/api/settings/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Save Settings to Database
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiRequest("/api/settings", {
        method: "PUT",
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated.settings);
        
        // Instant Theme Application
        if (updated.settings.darkMode) {
          document.body.classList.add("dark-mode");
        } else {
          document.body.classList.remove("dark-mode");
        }
        
        // Save locally for MainLayout check
        localStorage.setItem("erp-settings", JSON.stringify(updated.settings));

        alert("System settings saved successfully ✅");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save settings");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Trigger JSON database backup download
  const handleBackup = async () => {
    try {
      const res = await apiRequest("/api/settings/backup");
      if (!res.ok) throw new Error("Failed to compile backup");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `amdox-erp-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      alert("Backup downloaded successfully ✅");
    } catch (err) {
      alert("Error generating backup: " + err.message);
    }
  };

  // Handle Restore file upload
  const handleRestore = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const confirmRestore = window.confirm("WARNING: Restoring will overwrite existing records. Proceed?");
    if (!confirmRestore) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const backupJson = JSON.parse(evt.target.result);
        const res = await apiRequest("/api/settings/restore", {
          method: "POST",
          body: JSON.stringify(backupJson)
        });

        if (res.ok) {
          alert("Database records successfully restored! 🔄");
          window.location.reload();
        } else {
          const err = await res.json();
          alert("Restore failed: " + err.message);
        }
      } catch (err) {
        alert("Invalid backup file structure: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Theme Dropdown trigger
  const handleThemeChange = (themeName) => {
    const updated = { ...settings, theme: themeName };
    setSettings(updated);
    if (themeName) {
      document.documentElement.setAttribute("data-theme", themeName);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("erp-settings", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <Loader2 className="animate-spin" size={48} style={{ color: "var(--primary-color)" }} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Settings Panel"
        subtitle="Manage ERP preferences, access permissions, security logs, and data backups."
      />

      {/* Tabs Layout */}
      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Left tabs selector */}
        <div className="card" style={{ flex: "1 1 200px", padding: "12px", height: "fit-content" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button
              onClick={() => setTab("general")}
              style={{
                textAlign: "left", padding: "10px 14px", border: "none", borderRadius: "8px", cursor: "pointer",
                background: tab === "general" ? "var(--primary-color)" : "transparent",
                color: tab === "general" ? "#ffffff" : "var(--text-main)", fontWeight: "600"
              }}
            >
              General Settings
            </button>
            <button
              onClick={() => setTab("appearance")}
              style={{
                textAlign: "left", padding: "10px 14px", border: "none", borderRadius: "8px", cursor: "pointer",
                background: tab === "appearance" ? "var(--primary-color)" : "transparent",
                color: tab === "appearance" ? "#ffffff" : "var(--text-main)", fontWeight: "600"
              }}
            >
              Appearance Themes
            </button>
            {role === "admin" && (
              <>
                <button
                  onClick={() => setTab("security")}
                  style={{
                    textAlign: "left", padding: "10px 14px", border: "none", borderRadius: "8px", cursor: "pointer",
                    background: tab === "security" ? "var(--primary-color)" : "transparent",
                    color: tab === "security" ? "#ffffff" : "var(--text-main)", fontWeight: "600"
                  }}
                >
                  SMTP & Email Setup
                </button>
                <button
                  onClick={() => setTab("ai")}
                  style={{
                    textAlign: "left", padding: "10px 14px", border: "none", borderRadius: "8px", cursor: "pointer",
                    background: tab === "ai" ? "var(--primary-color)" : "transparent",
                    color: tab === "ai" ? "#ffffff" : "var(--text-main)", fontWeight: "600"
                  }}
                >
                  AI Assistant Settings
                </button>
                <button
                  onClick={() => setTab("backup")}
                  style={{
                    textAlign: "left", padding: "10px 14px", border: "none", borderRadius: "8px", cursor: "pointer",
                    background: tab === "backup" ? "var(--primary-color)" : "transparent",
                    color: tab === "backup" ? "#ffffff" : "var(--text-main)", fontWeight: "600"
                  }}
                >
                  Backup & Security Logs
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Tab Content Panel */}
        <div style={{ flex: "3 1 600px" }}>
          
          {/* 1. General Panel */}
          {tab === "general" && (
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Building2 size={22} style={{ color: "var(--primary-color)" }} />
                <h3 style={{ margin: 0 }}>Company Information</h3>
              </div>
              <div className="form-grid" style={{ marginBottom: "20px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Company Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="companyName"
                    value={settings.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Company Email</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={settings.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-grid">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>System Language</label>
                  <select className="form-input" name="language" value={settings.language} onChange={handleChange}>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>German</option>
                    <option>Hindi</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Default Timezone</label>
                  <select className="form-input" name="timezone" value={settings.timezone} onChange={handleChange}>
                    <option>Asia/Kolkata</option>
                    <option>America/New_York</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 2. Appearance Panel */}
          {tab === "appearance" && (
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Sun size={22} style={{ color: "var(--primary-color)" }} />
                <h3 style={{ margin: 0 }}>Visual Themes</h3>
              </div>

              {/* Theme selectors */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ margin: 0 }}>Dark Mode Mode</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px", margin: "4px 0 0" }}>Toggle dark background colors</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="darkMode"
                      checked={settings.darkMode}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Select Corporate Theme Accent</label>
                  <select
                    className="form-input"
                    value={settings.theme || ""}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    style={{ width: "100%", maxWidth: "300px" }}
                  >
                    <option value="">Default Amdox Indigo</option>
                    <option value="sapphire">SAP Sapphire (Blue & Steel)</option>
                    <option value="emerald">Odoo Emerald (Mint Green)</option>
                    <option value="amber">Zoho Amber (Warm Orange)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. SMTP setup */}
          {tab === "security" && (
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Bell size={22} style={{ color: "var(--primary-color)" }} />
                <h3 style={{ margin: 0 }}>SMTP Email Configuration</h3>
              </div>
              <div className="form-grid" style={{ marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>SMTP Host</label>
                  <input className="form-input" type="text" name="smtpHost" value={settings.smtpHost || ""} onChange={handleChange} placeholder="smtp.mailtrap.io" />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>SMTP Port</label>
                  <input className="form-input" type="number" name="smtpPort" value={settings.smtpPort || 587} onChange={handleChange} />
                </div>
              </div>
              <div className="form-grid">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>SMTP Username</label>
                  <input className="form-input" type="text" name="smtpUser" value={settings.smtpUser || ""} onChange={handleChange} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>SMTP Password</label>
                  <input className="form-input" type="password" name="smtpPass" value={settings.smtpPass || ""} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* 4. AI config */}
          {tab === "ai" && (
            <div className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <Brain size={22} style={{ color: "var(--primary-color)" }} />
                <h3 style={{ margin: 0 }}>AI Provider Integrations</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>Active LLM Provider</label>
                  <select
                    className="form-input"
                    name="llmProvider"
                    value={settings.llmProvider}
                    onChange={handleChange}
                    style={{ width: "100%", maxWidth: "300px" }}
                  >
                    <option value="mock">Fallback Smart Query Parser (No API Keys needed)</option>
                    <option value="openai">OpenAI (GPT-4o-mini)</option>
                    <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
                  </select>
                </div>

                {settings.llmProvider !== "mock" && (
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "8px" }}>API Secret Key</label>
                    <input
                      className="form-input"
                      type="password"
                      name="llmApiKey"
                      value={settings.llmApiKey || ""}
                      onChange={handleChange}
                      placeholder="sk-..."
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Backups & Logs */}
          {tab === "backup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Backups card */}
              <div className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <Database size={22} style={{ color: "var(--primary-color)" }} />
                  <h3 style={{ margin: 0 }}>Database Backup & Restoration</h3>
                </div>

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <button onClick={handleBackup} className="btn btn-primary">
                    <Database size={16} />
                    Download Backup JSON
                  </button>
                  
                  <label className="btn btn-secondary" style={{ display: "inline-flex", cursor: "pointer", gap: "8px", alignItems: "center", margin: 0 }}>
                    <Upload size={16} />
                    Upload & Restore Backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestore}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              {/* Logs card */}
              <div className="card" style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <Lock size={22} style={{ color: "var(--primary-color)" }} />
                  <h3 style={{ margin: 0 }}>Administrative Audit & Security Logs</h3>
                </div>
                
                <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <table className="erp-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>Module</th>
                        <th>IP Address</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length > 0 ? (
                        logs.map((log) => (
                          <tr key={log._id}>
                            <td style={{ fontSize: "12px" }}>{log.userName}</td>
                            <td style={{ fontSize: "12px", fontWeight: "600" }}>{log.action}</td>
                            <td style={{ fontSize: "12px" }}>{log.module}</td>
                            <td style={{ fontSize: "12px" }}>{log.ipAddress || "Local"}</td>
                            <td style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              {new Date(log.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center", padding: "16px" }}>No log entries found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Save triggers at bottom */}
          {tab !== "backup" && (
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                Save Settings
              </button>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}