import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  Shield,
  Calendar,
  Clock,
  Edit,
  Save,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // Edit State
  // ─────────────────────────────────────────────
  const [isEditing, setIsEditing] =
    useState(false);

  // ─────────────────────────────────────────────
  // User State
  // ─────────────────────────────────────────────
  const [user, setUser] = useState({
    name: "Admin User",

    role: "Administrator",

    email: "admin@erp.com",

    phone: "+91 9876543210",

    department: "Administration",

    designation: "System Admin",

    joiningDate: "12 Jan 2024",

    lastLogin: "Today, 10:45 AM",
  });

  // ─────────────────────────────────────────────
  // Load Saved Profile
  // ─────────────────────────────────────────────
  useEffect(() => {
    const savedProfile =
      localStorage.getItem("profile");

    if (savedProfile) {
      setUser(JSON.parse(savedProfile));
    }
  }, []);

  // ─────────────────────────────────────────────
  // Handle Input
  // ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ─────────────────────────────────────────────
  // Save Profile
  // ─────────────────────────────────────────────
  const handleEditToggle = () => {
    // Save Mode
    if (isEditing) {
      localStorage.setItem(
        "profile",
        JSON.stringify(user)
      );

      alert("Profile Updated ✅");
    }

    setIsEditing(!isEditing);
  };

  return (
    <div
      style={{
        padding: "24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "6px",
            }}
          >
            👤 My Profile
          </h1>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Manage your account information
            and preferences.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* Profile Card */}
      <div className="content-card">
        {/* Top Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#2563eb,#7c3aed)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              color: "#fff",

              fontSize: "38px",

              fontWeight: "700",
            }}
          >
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          {/* User Info */}
          <div style={{ flex: 1 }}>
            {/* Name */}
            {isEditing ? (
              <input
                className="form-input"
                name="name"
                value={user.name}
                onChange={handleChange}
                style={{
                  maxWidth: "300px",
                  marginBottom: "12px",
                }}
              />
            ) : (
              <h2
                style={{
                  marginBottom: "10px",
                }}
              >
                {user.name}
              </h2>
            )}

            {/* Role Badge */}
            <div
              style={{
                display: "inline-flex",

                alignItems: "center",

                gap: "8px",

                background:
                  "rgba(37,99,235,0.12)",

                color: "#2563eb",

                padding: "6px 12px",

                borderRadius: "999px",

                fontSize: "13px",

                fontWeight: "600",

                marginBottom: "16px",
              }}
            >
              <Shield size={14} />

              {user.role}
            </div>

            {/* User Details */}
            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",

                gap: "14px",

                marginTop: "10px",
              }}
            >
              {/* Email */}
              <div
                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: "10px",
                }}
              >
                <Mail size={18} />

                {isEditing ? (
                  <input
                    className="form-input"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </div>

              {/* Phone */}
              <div
                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: "10px",
                }}
              >
                <Phone size={18} />

                {isEditing ? (
                  <input
                    className="form-input"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user.phone}</span>
                )}
              </div>

              {/* Department */}
              <div
                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: "10px",
                }}
              >
                <Building2 size={18} />

                {isEditing ? (
                  <input
                    className="form-input"
                    name="department"
                    value={user.department}
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    {user.department}
                  </span>
                )}
              </div>

              {/* Designation */}
              <div
                style={{
                  display: "flex",

                  alignItems: "center",

                  gap: "10px",
                }}
              >
                <Briefcase size={18} />

                {isEditing ? (
                  <input
                    className="form-input"
                    name="designation"
                    value={user.designation}
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    {user.designation}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit / Save Button */}
          <button
            className="btn btn-secondary"
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <Save size={16} />
                Save Profile
              </>
            ) : (
              <>
                <Edit size={16} />
                Edit Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Additional Cards */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",

          gap: "24px",

          marginTop: "24px",
        }}
      >
        {/* Account Info */}
        <div className="content-card">
          <h3
            style={{
              marginBottom: "24px",
            }}
          >
            Account Information
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Employee ID */}
            <div>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginBottom: "6px",
                }}
              >
                Employee ID
              </p>

              <h4
                style={{
                  margin: 0,
                }}
              >
                EMP-001
              </h4>
            </div>

            {/* Role */}
            <div>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginBottom: "6px",
                }}
              >
                Role
              </p>

              <h4
                style={{
                  margin: 0,
                }}
              >
                {user.role}
              </h4>
            </div>

            {/* Status */}
            <div>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                  marginBottom: "8px",
                }}
              >
                Status
              </p>

              <span className="status-badge active">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="content-card">
          <h3
            style={{
              marginBottom: "20px",
            }}
          >
            Recent Activity
          </h3>

          <div
            style={{
              display: "flex",

              flexDirection: "column",

              gap: "18px",
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: "12px",
              }}
            >
              <Calendar size={18} />

              <div>
                <p
                  style={{
                    fontWeight: "600",
                  }}
                >
                  Joining Date
                </p>

                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  {user.joiningDate}
                </small>
              </div>
            </div>

            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: "12px",
              }}
            >
              <Clock size={18} />

              <div>
                <p
                  style={{
                    fontWeight: "600",
                  }}
                >
                  Last Login
                </p>

                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  {user.lastLogin}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;