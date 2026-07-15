import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Users.css";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import { apiRequest } from "../../utils/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");   // 🔍 search state
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const navigate = useNavigate();

  // Create User States
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createData, setCreateData] = useState({
    name: "",
    email: "",
    role: "employee",
    department: "",
    designation: ""
  });
  const [createdTempPassword, setCreatedTempPassword] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreatedTempPassword("");

    try {
      const res = await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify(createData)
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("User created successfully! ✅");
        setCreatedTempPassword(data.tempPassword);
        // Clear creation form
        setCreateData({
          name: "",
          email: "",
          role: "employee",
          department: "",
          designation: ""
        });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await apiRequest("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // 🔥 DELETE FUNCTION
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete this user? ❌");
    if (!confirmDelete) return;

    try {
      const res = await apiRequest(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // 🔥 UPDATE FUNCTION
  const updateUser = async () => {
    try {
      const res = await apiRequest(`/api/users/${editingUserId}`, {
        method: "PUT",
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        toast.success("User updated successfully");
        setEditingUserId(null);
        fetchUsers();
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // 🔥 TOGGLE STATUS FUNCTION (Approve / Deactivate)
  const toggleUserStatus = async (userRecord) => {
    const nextStatus = !userRecord.active;
    const confirmMsg = nextStatus 
      ? `Approve user account for ${userRecord.email}?`
      : `Deactivate user account for ${userRecord.email}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await apiRequest(`/api/users/${userRecord._id}`, {
        method: "PUT",
        body: JSON.stringify({ active: nextStatus }),
      });
      if (res.ok) {
        toast.success(nextStatus ? "User approved successfully! ✅" : "User deactivated.");
        fetchUsers();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error toggling status");
    }
  };

  // 🔍 FILTER LOGIC
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="Users Management"
        subtitle="Review registered user profiles, modify roles, or delete system credentials."
        backUrl="/dashboard"
        actionText={showCreateForm ? "Hide Form" : "Create User"}
        onAction={() => {
          setShowCreateForm(!showCreateForm);
          setCreatedTempPassword("");
        }}
      />

      <div style={{ marginTop: "24px" }}>
        {/* CREATE USER FORM */}
        {showCreateForm && (
          <div className="card" style={{ marginBottom: "24px", padding: "20px" }}>
            <div className="card-header" style={{ padding: "0 0 16px", borderBottom: "1px solid var(--border-color)", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>Create New User Account</h3>
            </div>
            
            <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={createData.name}
                    onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                    className="form-input"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john.doe@company.com"
                    value={createData.email}
                    onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                    className="form-input"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Department</label>
                  <input
                    type="text"
                    placeholder="HR / Sales / Operations..."
                    value={createData.department}
                    onChange={(e) => setCreateData({ ...createData, department: e.target.value })}
                    className="form-input"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Designation</label>
                  <input
                    type="text"
                    placeholder="Executive / Manager / Associate..."
                    value={createData.designation}
                    onChange={(e) => setCreateData({ ...createData, designation: e.target.value })}
                    className="form-input"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px" }}>Assign Role</label>
                  <select
                    value={createData.role}
                    onChange={(e) => setCreateData({ ...createData, role: e.target.value })}
                    className="form-input"
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "#fff" }}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                    <option value="inventory">Inventory</option>
                    <option value="sales">Sales</option>
                    <option value="purchase">Purchase</option>
                    <option value="crm">CRM</option>
                    <option value="project">Project</option>
                    <option value="helpdesk">Helpdesk</option>
                    <option value="asset">Asset</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary" style={{ padding: "8px 16px" }}>
                  Create User
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowCreateForm(false); setCreatedTempPassword(""); }} style={{ padding: "8px 16px" }}>
                  Cancel
                </button>
              </div>
            </form>

            {createdTempPassword && (
              <div style={{ marginTop: "16px", padding: "14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534" }}>
                <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>Account Created Successfully! 🎉</p>
                <p style={{ margin: "0 0 6px 0", fontSize: "13px" }}>Please copy this temporary password and share it with the user to login:</p>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", fontFamily: "monospace", letterSpacing: "1px", background: "#dcfce7", display: "inline-block", padding: "4px 8px", borderRadius: "4px" }}>
                  {createdTempPassword}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 🔍 SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="users-grid">
          {filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              {editingUserId === user._id ? (
                <>
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    placeholder="Enter name"
                  />
                  <input
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />

                  <select
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>

                  <button onClick={updateUser}>Save ✅</button>
                </>
              ) : (
                <>
                  <p><b>Name:</b> {user.name}</p>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Role:</b> {user.role}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span style={{
                      fontWeight: "700",
                      color: user.active ? "#16a34a" : "#dc2626",
                      background: user.active ? "#dcfce7" : "#fee2e2",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "11px"
                    }}>
                      {user.active ? "Active" : "Pending Approval"}
                    </span>
                  </p>

                  <div className="action-row" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete ❌
                    </button>

                    <button
                      onClick={() => {
                        setEditingUserId(user._id);
                        setEditData(user);   // 🔥 IMPORTANT
                      }}
                    >
                      Edit ✏️
                    </button>

                    <button
                      onClick={() => toggleUserStatus(user)}
                      style={{
                        background: user.active ? "#f3f4f6" : "#3b82f6",
                        color: user.active ? "#374151" : "#ffffff",
                        border: "1px solid",
                        borderColor: user.active ? "#d1d5db" : "#3b82f6",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      {user.active ? "Deactivate" : "Approve"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;