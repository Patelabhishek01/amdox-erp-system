import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Users.css";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");   // 🔍 search state
    const [editingUserId, setEditingUserId] = useState(null);
    const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: ""
    });
  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Fetch users
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(data);
  };

  // 🔥 DELETE FUNCTION
  const deleteUser = async (id) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm("Are you sure to delete this user? ❌");

    if (!confirmDelete) return;
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    toast.success(data.message);

    fetchUsers(); // 🔄 refresh
  };
const updateUser = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/users/${editingUserId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(editData),
  });

  const data = await res.json();

  toast.success(data.message);

  setEditingUserId(null);   // edit mode band
  fetchUsers();             // refresh
};
  // 🔍 FILTER LOGIC
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );
  const navigate = useNavigate();
  return (
  
    <div className="users-container">
      <h2 className="users-title">👑 Users List</h2>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
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

                <div className="action-row">
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
                </div>
                </>
            )}

            </div>
        ))}
      </div>
    </div>
    
  );
};

export default Users;