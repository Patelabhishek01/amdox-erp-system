import { useState } from "react";
import "./LoginForm.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { saveAuthData } from "../../utils/auth";
import { Compass, KeyRound, Award } from "lucide-react";
import { FaGithub, FaGoogle, FaMicrosoft } from "react-icons/fa";

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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    rememberMe: false
  });

  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [tempAccessToken, setTempAccessToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          otp: twoFactorRequired ? formData.otp : undefined
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // If password change is forced on first login
        if (data.forcePasswordChange) {
          setForcePasswordChange(true);
          setTempAccessToken(data.accessToken);
          setLoading(false);
          return;
        }

        // If 2FA is required, step into OTP submission form
        if (data.twoFactorRequired) {
          setTwoFactorRequired(true);
          setTempUserId(data.userId);
          setLoading(false);
          return;
        }

        const token = data.accessToken || data.token;
        const refreshToken = data.refreshToken;
        const role = data.user?.role || "employee";
        const user = data.user;

        saveAuthData({ token, role, user });
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Apply dark mode if user has settings
        const settingsRes = await fetch(`${API_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings.darkMode) {
            document.body.classList.add("dark-mode");
          } else {
            document.body.classList.remove("dark-mode");
          }
          localStorage.setItem("erp-settings", JSON.stringify(settings));
        }

        const redirectTo = location.state?.from?.pathname || ROLE_REDIRECT[role] || "/dashboard";
        navigate(redirectTo, { replace: true });
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Please verify API status.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError("Password must be at least 8 characters long, contain an uppercase letter, and a number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tempAccessToken}`
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        // Automatically log the user in after successful change!
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: newPassword
          }),
        });

        const loginData = await loginRes.json();
        if (loginRes.ok) {
          const token = loginData.accessToken || loginData.token;
          const refreshToken = loginData.refreshToken;
          const role = loginData.user?.role || "employee";
          const user = loginData.user;

          saveAuthData({ token, role, user });
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }

          // Apply settings
          const settingsRes = await fetch(`${API_URL}/api/settings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (settingsRes.ok) {
            const settings = await settingsRes.json();
            if (settings.darkMode) {
              document.body.classList.add("dark-mode");
            } else {
              document.body.classList.remove("dark-mode");
            }
            localStorage.setItem("erp-settings", JSON.stringify(settings));
          }

          const redirectTo = location.state?.from?.pathname || ROLE_REDIRECT[role] || "/dashboard";
          navigate(redirectTo, { replace: true });
        } else {
          setError(loginData.message || "Password changed, but auto-login failed. Please sign in manually.");
          setForcePasswordChange(false);
          setTempAccessToken("");
          setNewPassword("");
          setConfirmNewPassword("");
        }
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Mock OAuth Sign-In (Creates or logs in user dynamically)
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");
    
    // Demo account details
    const email = `${provider}@amdox-erp.com`;
    const name = `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f4c81&color=fff`;

    try {
      const res = await fetch(`${API_URL}/api/auth/social-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, email, name, avatar })
      });

      const data = await res.json();
      if (res.ok) {
        const token = data.accessToken || data.token;
        saveAuthData({ token, role: data.user.role, user: data.user });
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        navigate("/dashboard", { replace: true });
      } else {
        setError(data.message || "OAuth login failed");
      }
    } catch (err) {
      setError("OAuth server request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-page)", padding: "16px" }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px", padding: "32px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", padding: "12px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary-color)", marginBottom: "12px" }}>
            <KeyRound size={28} />
          </div>
          <h2 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "700" }}>
            {forcePasswordChange ? "Reset Password" : (twoFactorRequired ? "2FA Verification" : "Amdox ERP Suite")}
          </h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>
            {forcePasswordChange ? "First time login: please choose a secure new password to continue." : (twoFactorRequired ? "Enter the verification code from your authenticator app" : "Sign in to access corporate workspace")}
          </p>
        </div>

        {/* Display Errors */}
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {forcePasswordChange ? (
          <form onSubmit={handlePasswordResetSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>New Password</label>
              <input
                type="password"
                placeholder="Choose strong password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: "100%" }}
              />
              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "var(--text-muted)" }}>
                Must be at least 8 characters, include 1 uppercase letter and 1 number.
              </p>
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", height: "46px", justifyContent: "center", marginTop: "8px" }}>
              {loading ? "Updating password..." : "Update Password & Log In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {!twoFactorRequired ? (
              <>
                {/* Email */}
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                  />
                </div>

                {/* Session checks */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    Remember me
                  </label>
                  <span style={{ fontSize: "13px", color: "var(--primary-color)", cursor: "pointer" }}>Forgot password?</span>
                </div>
              </>
            ) : (
              /* OTP Field */
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="6-Digit OTP"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength="6"
                  autoFocus
                  style={{ width: "100%", letterSpacing: "8px", textAlign: "center", fontSize: "18px", fontWeight: "700" }}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", height: "46px", justifyContent: "center", marginTop: "8px" }}>
              {loading ? "Please wait..." : twoFactorRequired ? "Verify Code" : "Log In"}
            </button>
          </form>
        )}

        {!twoFactorRequired && !forcePasswordChange && (
          <>
            {/* Social Separator */}
            <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "10px" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
            </div>

            {/* Social mock buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              <button onClick={() => handleSocialLogin("google")} className="btn btn-secondary btn-sm" style={{ display: "flex", justifyContent: "center", padding: "8px 0" }} title="Google Authentication">
                <FaGoogle size={18} />
              </button>
              <button onClick={() => handleSocialLogin("microsoft")} className="btn btn-secondary btn-sm" style={{ display: "flex", justifyContent: "center", padding: "8px 0" }} title="Microsoft Authentication">
                <FaMicrosoft size={18} />
              </button>
              <button onClick={() => handleSocialLogin("github")} className="btn btn-secondary btn-sm" style={{ display: "flex", justifyContent: "center", padding: "8px 0" }} title="GitHub Authentication">
                <FaGithub size={18} />
              </button>
            </div>
          </>
        )}

        {!forcePasswordChange && (
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--primary-color)", fontWeight: "600" }}>Register here</Link>
          </div>
        )}

      </div>
    </div>
  );
};