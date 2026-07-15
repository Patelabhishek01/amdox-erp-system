import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { useState } from "react";
import { KeyRound, Check, RefreshCw } from "lucide-react";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

export const RegistrationFormReact = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "employee",
    companyName: "",
    invitationCode: ""
  });

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Password strength logic
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", color: "transparent", percent: 0 };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 1) return { label: "Weak ⚠️", color: "#ef4444", percent: 25 };
    if (score === 2 || score === 3) return { label: "Medium ⚡", color: "#eab308", percent: 60 };
    return { label: "Strong! 💪", color: "#16a34a", percent: 100 };
  };

  // Generate strong random password string
  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUser(prev => ({
      ...prev,
      password: pwd,
      confirmPassword: pwd
    }));
    alert(`Generated Password: ${pwd}\n(Copied into password fields)`);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!captchaChecked) {
      alert("Please verify that you are not a robot");
      return;
    }

    // Call API
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          phone: user.phoneNumber,
          role: user.role,
          companyName: user.companyName,
          invitationCode: user.invitationCode
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Registration request submitted successfully ✅. Please wait for an administrator to approve your account.");
        navigate("/");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Registration server request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    setLoading(true);
    setError("");
    
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
        saveAuthData({ token: data.accessToken || data.token, role: data.user.role, user: data.user });
        alert("Mock Social registration and login complete!");
        navigate("/dashboard");
      } else {
        setError(data.message || "OAuth login failed");
      }
    } catch (err) {
      setError("OAuth server request failed.");
    } finally {
      setLoading(false);
    }
  };

  const strength = checkPasswordStrength(user.password);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-page)", padding: "24px 16px" }}>
      <div className="card" style={{ width: "100%", maxWidth: "500px", padding: "32px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "inline-flex", padding: "12px", borderRadius: "12px", background: "var(--primary-light)", color: "var(--primary-color)", marginBottom: "12px" }}>
            <KeyRound size={28} />
          </div>
          <h2 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "700" }}>Create ERP Account</h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>Fill out corporate registration form</p>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div className="form-grid">
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>First Name</label>
              <input type="text" name="firstName" placeholder="Rahul" required value={user.firstName} onChange={handleInputChange} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Last Name</label>
              <input type="text" name="lastName" placeholder="Sharma" required value={user.lastName} onChange={handleInputChange} style={{ width: "100%" }} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Email</label>
              <input type="email" name="email" placeholder="rahul@company.com" required value={user.email} onChange={handleInputChange} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Phone Number</label>
              <input type="tel" name="phoneNumber" placeholder="9876543210" required value={user.phoneNumber} onChange={handleInputChange} style={{ width: "100%" }} />
            </div>
          </div>

          <div className="form-grid">
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Company Name</label>
              <input type="text" name="companyName" placeholder="Amdox Global" value={user.companyName} onChange={handleInputChange} style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Corporate Invitation Code</label>
              <input type="text" name="invitationCode" placeholder="AMDOX-ENTERPRISE-2026" value={user.invitationCode} onChange={handleInputChange} style={{ width: "100%" }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Select Role</label>
            <select name="role" value={user.role} onChange={handleInputChange} style={{ width: "100%" }}>
              <option value="employee">Employee</option>
              <option value="hr">HR Manager</option>
              <option value="finance">Finance Manager</option>
              <option value="inventory">Inventory Manager</option>
              <option value="sales">Sales Officer</option>
              <option value="purchase">Purchase Manager</option>
              <option value="crm">CRM Manager</option>
              <option value="project">Project Manager</option>
              <option value="helpdesk">Help Desk Officer</option>
              <option value="asset">Asset Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", margin: 0 }}>Password</label>
              <button
                type="button"
                onClick={generateStrongPassword}
                style={{
                  background: "transparent", border: "none", cursor: "pointer", color: "var(--primary-color)",
                  fontSize: "12px", display: "flex", alignItems: "center", gap: "4px"
                }}
              >
                <RefreshCw size={12} />
                Generate Password
              </button>
            </div>
            <input type="password" name="password" placeholder="••••••••" required value={user.password} onChange={handleInputChange} style={{ width: "100%" }} />
            
            {/* Strength Meter */}
            {user.password && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" }}>
                  <span>Password Strength:</span>
                  <span style={{ color: strength.color, fontWeight: "700" }}>{strength.label}</span>
                </div>
                <div style={{ width: "100%", height: "4px", background: "var(--border-color)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${strength.percent}%`, height: "4px", background: strength.color, transition: "width 0.3s" }}></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="••••••••" required value={user.confirmPassword} onChange={handleInputChange} style={{ width: "100%" }} />
            {user.confirmPassword && user.password !== user.confirmPassword && (
              <p style={{ color: "#dc2626", fontSize: "12px", margin: "6px 0 0" }}>Passwords do not match</p>
            )}
          </div>

          {/* Captcha checkbox mockup */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-page)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-color)", margin: "8px 0" }}>
            <input
              type="checkbox"
              id="captcha"
              checked={captchaChecked}
              onChange={(e) => setCaptchaChecked(e.target.checked)}
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
            />
            <label htmlFor="captcha" style={{ fontSize: "13px", cursor: "pointer", userSelect: "none" }}>
              I verify that I am not a robot 🤖
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", height: "46px", justifyContent: "center" }}>
            {loading ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        {/* OAuth Separator */}
        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Sign up with</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          <button onClick={() => handleSocialRegister("google")} className="btn btn-secondary btn-sm" style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <FaGoogle size={18} />
          </button>
          <button onClick={() => handleSocialRegister("microsoft")} className="btn btn-secondary btn-sm" style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <FaMicrosoft size={18} />
          </button>
          <button onClick={() => handleSocialRegister("github")} className="btn btn-secondary btn-sm" style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <FaGithub size={18} />
          </button>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px" }}>
          <span>Already registered? </span>
          <Link to="/" style={{ color: "var(--primary-color)", fontWeight: "600" }}>Log In Here</Link>
        </div>

      </div>
    </div>
  );
};