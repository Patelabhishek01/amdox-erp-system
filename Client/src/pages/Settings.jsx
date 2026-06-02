import { useEffect, useState } from "react";

import MainLayout from "../component/layouts/MainLayout";
import PageHeader from "../component/ui/PageHeader";

import {
  Moon,
  Sun,
  Bell,
  Shield,
  Globe,
  Save,
  Building2,
} from "lucide-react";

export default function Settings() {
  // ─────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────
  const [settings, setSettings] =
    useState({
      companyName: "Amdox ERP",

      email: "admin@erp.com",

      language: "English",

      timezone: "Asia/Kolkata",

      notifications: true,

      darkMode: false,

      twoFactorAuth: false,
    });

  // ─────────────────────────────────────────────
  // Load Saved Settings
  // ─────────────────────────────────────────────
  useEffect(() => {
    const savedSettings =
      localStorage.getItem("erp-settings");

    if (savedSettings) {
      const parsed =
        JSON.parse(savedSettings);

      setSettings(parsed);

      // Apply dark mode instantly
      if (parsed.darkMode) {
        document.body.classList.add(
          "dark-mode"
        );
      }
    }
  }, []);

  // ─────────────────────────────────────────────
  // Handle Input Changes
  // ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ─────────────────────────────────────────────
  // Toggle Dark Mode
  // ─────────────────────────────────────────────
  const toggleDarkMode = () => {
    const updatedDarkMode =
      !settings.darkMode;

    const updatedSettings = {
      ...settings,
      darkMode: updatedDarkMode,
    };

    setSettings(updatedSettings);

    // Apply class
    if (updatedDarkMode) {
      document.body.classList.add(
        "dark-mode"
      );
    } else {
      document.body.classList.remove(
        "dark-mode"
      );
    }

    // Save instantly
    localStorage.setItem(
      "erp-settings",
      JSON.stringify(updatedSettings)
    );
  };

  // ─────────────────────────────────────────────
  // Save Settings
  // ─────────────────────────────────────────────
  const handleSave = () => {
    localStorage.setItem(
      "erp-settings",
      JSON.stringify(settings)
    );

    alert("Settings saved successfully ✅");
  };

  return (
    <MainLayout>
      <PageHeader
        title="System Settings"
        subtitle="Manage ERP preferences, themes, security, and configurations."
      />

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Company Settings */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Building2 size={22} />
            <h2>Company Settings</h2>
          </div>

          <div className="form-grid">
            <input
              className="form-input"
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Company Name"
            />

            <input
              className="form-input"
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="Company Email"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {settings.darkMode ? (
              <Moon size={22} />
            ) : (
              <Sun size={22} />
            )}

            <h2>Appearance</h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "12px 0",
            }}
          >
            <div>
              <h4>Dark Mode</h4>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              >
                Enable dark theme for ERP
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={toggleDarkMode}
              />

              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Bell size={22} />
            <h2>Notifications</h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "12px 0",
            }}
          >
            <div>
              <h4>Email Notifications</h4>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              >
                Receive system alerts
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                name="notifications"
                checked={
                  settings.notifications
                }
                onChange={handleChange}
              />

              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Shield size={22} />
            <h2>Security</h2>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              padding: "12px 0",
            }}
          >
            <div>
              <h4>Two-Factor Authentication</h4>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              >
                Extra security for accounts
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={
                  settings.twoFactorAuth
                }
                onChange={handleChange}
              />

              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="content-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <Globe size={22} />
            <h2>Regional Settings</h2>
          </div>

          <div className="form-grid">
            <select
              className="form-input"
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option>English</option>
              <option>Hindi</option>
            </select>

            <select
              className="form-input"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
            >
              <option>
                Asia/Kolkata
              </option>

              <option>
                America/New_York
              </option>

              <option>UTC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={handleSave}
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </MainLayout>
  );
}