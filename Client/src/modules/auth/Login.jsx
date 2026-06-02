import { useState } from "react";
import "./LoginForm.css";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  saveAuthData,
} from "../../utils/auth";

// ─────────────────────────────────────────────
// Role → Redirect Mapping
// ─────────────────────────────────────────────
const ROLE_REDIRECT = {
  admin: "/dashboard",

  hr: "/hr-dashboard",

  finance: "/finance/expenses",

  inventory: "/inventory-dashboard",

  sales: "/sales-dashboard",

  purchase: "/purchase-dashboard",

  crm: "/crm-dashboard",

  project: "/project-dashboard",

  helpdesk: "/helpdesk-dashboard",

  asset: "/asset-dashboard",

  employee: "/profile",
};

export const LoginForm = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ─────────────────────────────────────────────
  // Handle Input
  // ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ─────────────────────────────────────────────
  // Handle Login
  // ─────────────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      // ─────────────────────────────────────────
      // Success
      // ─────────────────────────────────────────
      if (res.ok) {
        console.log("RESPONSE:", data);

        if (!data.token) {
          throw new Error(
            `Token not received. Response: ${JSON.stringify(data)}`
          );
        }

        const token = data.token;

        const payload = JSON.parse(
          atob(token.split(".")[1])
        );

        const role = payload.role || "employee";

        const user = data.user || payload;

        saveAuthData({
          token,
          role,
          user,
        });

        const redirectTo =
          location.state?.from?.pathname ||
          ROLE_REDIRECT[role] ||
          "/dashboard";

        navigate(redirectTo, {
          replace: true,
        });
      }

      // ─────────────────────────────────────────
      // Failed
      // ─────────────────────────────────────────
      else {
        setError(
          data.message ||
            "Invalid credentials"
        );
      }
    } catch (error) {
      console.log(error);

      setError(
        "Server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h1>ERP Login</h1>

        <p
          style={{
            marginBottom: "20px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Sign in to access your ERP dashboard
        </p>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>

          {/* Email */}
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password */}
          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          {/* Register */}
          <span
            style={{
              display: "block",
              marginTop: "18px",
              textAlign: "center",
            }}
          >
            Don't have an account?{" "}
            <Link to="/register">
              Sign Up
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};