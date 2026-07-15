import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import RecordComments from "../../component/ui/RecordComments";
import RecordTimeline from "../../component/ui/RecordTimeline";
import { apiRequest } from "../../utils/api";
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
  Loader2,
  Trash2,
  CheckCircle,
  FileText,
  UserCheck,
  Globe,
  Plus,
  X
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Profile state
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "employee",
    phone: "",
    department: "",
    designation: "",
    profilePhoto: "",
    resume: "",
    joiningDate: "",
    employeeId: "",
    emergencyContact: { name: "", phone: "", relationship: "" },
    bio: "",
    skills: [],
    socialLinks: { github: "", linkedin: "", twitter: "" }
  });

  const [newSkill, setNewSkill] = useState("");
  const [sessions, setSessions] = useState([]);
  
  // Fetch Profile & Sessions
  const fetchProfileData = useCallback(async () => {
    try {
      const res = await apiRequest("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (!data.socialLinks) data.socialLinks = { github: "", linkedin: "", twitter: "" };
        if (!data.emergencyContact) data.emergencyContact = { name: "", phone: "", relationship: "" };
        setUser(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await apiRequest("/api/auth/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
    fetchSessions();
  }, [fetchProfileData, fetchSessions]);

  // Handle Text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Nested inputs
  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  // Profile completion percent calculator
  const calculateCompletion = () => {
    let score = 0;
    let total = 8;
    if (user.name) score++;
    if (user.phone) score++;
    if (user.bio) score++;
    if (user.profilePhoto) score++;
    if (user.resume) score++;
    if (user.emergencyContact?.name && user.emergencyContact?.phone) score++;
    if (user.skills?.length > 0) score++;
    if (user.socialLinks?.github || user.socialLinks?.linkedin) score++;

    return Math.round((score / total) * 100);
  };

  // File uploader handler
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type); // 'avatar' or 'resume'

    try {
      const res = await apiRequest("/api/profile/upload", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({
          ...prev,
          [type === "avatar" ? "profilePhoto" : "resume"]: data.fileUrl
        }));
        alert(`${type === "avatar" ? "Photo" : "Resume"} uploaded successfully ✅`);
      } else {
        const err = await res.json();
        alert(err.message || "File upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Save changes
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await apiRequest("/api/profile", {
        method: "PUT",
        body: JSON.stringify(user)
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsEditing(false);
        alert("Profile details saved successfully ✅");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  // Revoke Session handler
  const handleRevokeSession = async (sessionId) => {
    const confirmRevoke = window.confirm("Are you sure you want to end this login session?");
    if (!confirmRevoke) return;

    try {
      const res = await apiRequest("/api/auth/sessions/revoke", {
        method: "POST",
        body: JSON.stringify({ sessionId })
      });

      if (res.ok) {
        fetchSessions();
        alert("Session ended successfully ❌");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Skill handles
  const handleAddSkill = () => {
    if (!newSkill.trim() || user.skills.includes(newSkill.trim())) return;
    setUser(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill("");
  };

  const handleRemoveSkill = (skill) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
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

  const completionPercent = calculateCompletion();
  const avatarUrl = user.profilePhoto 
    ? `http://localhost:5000${user.profilePhoto}` 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;

  return (
    <MainLayout>
      <PageHeader
        title="Employee Profile Console"
        subtitle="Manage your personal details, emergency records, attachments, and login devices."
      />

      <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
        
        {/* Left Column (Avatar + Completion Card) */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Avatar details Card */}
          <div className="card" style={{ padding: "24px", textAlign: "center" }}>
            <div style={{ position: "relative", width: "130px", height: "130px", margin: "0 auto 16px" }}>
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                style={{ width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--border-color)" }}
              />
              
              {isEditing && (
                <label
                  style={{
                    position: "absolute", bottom: "0", right: "0", background: "var(--primary-color)",
                    color: "#ffffff", padding: "6px", borderRadius: "50%", cursor: "pointer", display: "flex"
                  }}
                  title="Upload profile picture"
                >
                  <Edit size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "avatar")}
                    style={{ display: "none" }}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <h3 style={{ margin: "0 0 6px" }}>{user.name}</h3>
            <span
              style={{
                display: "inline-block", background: "var(--primary-light)", color: "var(--primary-color)",
                padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                textTransform: "capitalize", marginBottom: "16px"
              }}
            >
              {user.role}
            </span>

            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px" }}>
              {user.bio || "No biography statement set yet."}
            </p>

            {/* Profile completion bar */}
            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>
                <span>Profile Completion</span>
                <span>{completionPercent}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ width: `${completionPercent}%`, height: "8px", background: "var(--primary-color)", transition: "width 0.5s ease" }}></div>
              </div>
            </div>
          </div>

          {/* Social connections card */}
          <div className="card" style={{ padding: "24px" }}>
            <h4 style={{ margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Globe size={18} />
              Professional Links
            </h4>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>LinkedIn URL</label>
                {isEditing ? (
                  <input
                    className="form-input"
                    type="text"
                    name="linkedin"
                    value={user.socialLinks.linkedin}
                    onChange={(e) => handleNestedChange(e, "socialLinks")}
                    placeholder="https://linkedin.com/in/..."
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                ) : (
                  <p style={{ margin: "4px 0 0", fontSize: "13px" }}>
                    {user.socialLinks.linkedin ? (
                      <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--primary-color)" }}>LinkedIn Profile</a>
                    ) : "Not configured"}
                  </p>
                )}
              </div>
              
              <div>
                <label style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>GitHub URL</label>
                {isEditing ? (
                  <input
                    className="form-input"
                    type="text"
                    name="github"
                    value={user.socialLinks.github}
                    onChange={(e) => handleNestedChange(e, "socialLinks")}
                    placeholder="https://github.com/..."
                    style={{ width: "100%", marginTop: "4px" }}
                  />
                ) : (
                  <p style={{ margin: "4px 0 0", fontSize: "13px" }}>
                    {user.socialLinks.github ? (
                      <a href={user.socialLinks.github} target="_blank" rel="noreferrer" style={{ color: "var(--primary-color)" }}>GitHub Profile</a>
                    ) : "Not configured"}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Editable Info + Sessions List) */}
        <div style={{ flex: "2 1 500px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Main Info Card */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <UserCheck size={22} style={{ color: "var(--primary-color)" }} />
                Personal Details
              </h3>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={saving}
                style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
              >
                {isEditing ? (
                  <>
                    <Save size={14} />
                    {saving ? "Saving..." : "Save Details"}
                  </>
                ) : (
                  <>
                    <Edit size={14} />
                    Edit Details
                  </>
                )}
              </button>
            </div>

            {/* Editable Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-grid">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Contact Email</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={user.email}
                    disabled
                    style={{ width: "100%", background: "var(--bg-page)", cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Contact Phone</label>
                  <input
                    className="form-input"
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Biography Statement</label>
                  <input
                    className="form-input"
                    type="text"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Short bio note..."
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <hr style={{ border: "0", borderTop: "1px solid var(--border-color)", margin: "8px 0" }} />
              
              {/* Emergency Contact */}
              <h4 style={{ margin: "0 0 4px" }}>Emergency Contact Info</h4>
              <div className="form-grid">
                <div>
                  <label style={{ fontSize: "12px", display: "block", marginBottom: "6px" }}>Contact Name</label>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={user.emergencyContact.name}
                    onChange={(e) => handleNestedChange(e, "emergencyContact")}
                    disabled={!isEditing}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", display: "block", marginBottom: "6px" }}>Relationship</label>
                  <input
                    className="form-input"
                    type="text"
                    name="relationship"
                    value={user.emergencyContact.relationship}
                    onChange={(e) => handleNestedChange(e, "emergencyContact")}
                    disabled={!isEditing}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", display: "block", marginBottom: "6px" }}>Phone Number</label>
                  <input
                    className="form-input"
                    type="text"
                    name="phone"
                    value={user.emergencyContact.phone}
                    onChange={(e) => handleNestedChange(e, "emergencyContact")}
                    disabled={!isEditing}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <hr style={{ border: "0", borderTop: "1px solid var(--border-color)", margin: "8px 0" }} />

              {/* Skills Area */}
              <h4 style={{ margin: "0" }}>Skills & Specialties</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "8px 0" }}>
                {user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "var(--primary-light)", color: "var(--primary-color)", padding: "4px 10px",
                      borderRadius: "12px", fontSize: "12px", fontWeight: "600", display: "inline-flex",
                      alignItems: "center", gap: "6px"
                    }}
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", color: "var(--primary-color)", padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div style={{ display: "flex", gap: "8px", maxWidth: "300px" }}>
                  <input
                    className="form-input"
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill..."
                    style={{ flex: 1, height: "36px" }}
                  />
                  <button type="button" onClick={handleAddSkill} className="btn btn-primary btn-sm" style={{ height: "36px" }}>
                    <Plus size={14} />
                  </button>
                </div>
              )}

              {/* Resume File Upload */}
              <div style={{ marginTop: "12px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Resume / CV Attachment</label>
                {user.resume ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <a href={`http://localhost:5000${user.resume}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ textDecoration: "underline", display: "inline-flex", gap: "6px" }}>
                      <FileText size={14} />
                      View Uploaded Resume
                    </a>
                    {isEditing && (
                      <label className="btn btn-primary btn-sm" style={{ margin: 0, cursor: "pointer" }}>
                        Replace File
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, "resume")}
                          style={{ display: "none" }}
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <div>
                    {isEditing ? (
                      <label className="btn btn-primary btn-sm" style={{ margin: 0, cursor: "pointer" }}>
                        Upload PDF Resume
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, "resume")}
                          style={{ display: "none" }}
                          disabled={uploading}
                        />
                      </label>
                    ) : (
                      <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>No resume document uploaded.</p>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Active Sessions Card */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield size={22} style={{ color: "var(--primary-color)" }} />
              Active Login Sessions & Devices
            </h3>

            <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden" }}>
              <table className="erp-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>IP Address</th>
                    <th>Last Active</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((sess) => (
                    <tr key={sess._id}>
                      <td style={{ fontSize: "13px", fontWeight: "600" }}>{sess.device || "Browser Session"}</td>
                      <td style={{ fontSize: "12px" }}>{sess.ipAddress || "Localhost"}</td>
                      <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(sess.lastActive).toLocaleString()}</td>
                      <td>
                        <button
                          onClick={() => handleRevokeSession(sess._id)}
                          style={{
                            background: "transparent", border: "none", cursor: "pointer", color: "#dc2626",
                            fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px"
                          }}
                        >
                          <Trash2 size={12} />
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Internal Comments & Activity Logs */}
          {user.employeeRecordId && (
            <div className="card" style={{ padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px" }}>Performance Notes & Shared Activity Log</h3>
              <RecordComments recordId={user.employeeRecordId} module="employees" />
              <div style={{ marginTop: "24px" }}>
                <RecordTimeline recordId={user.employeeRecordId} module="employees" />
              </div>
            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}