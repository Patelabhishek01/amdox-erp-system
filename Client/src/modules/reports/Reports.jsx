import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Reports.css";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

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
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Users Report", 14, 10);

    const tableData = filteredUsers.map((u, index) => [
      index + 1,
      u.name,
      u.email,
      u.role,
    ]);

    autoTable(doc, {
      head: [["#", "Name", "Email", "Role"]],
      body: tableData,
    });

    doc.save("users_report.pdf");
  };
  // 🔍 Filter
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 CSV Export
  const exportCSV = () => {
    const csv = [
      ["Name", "Email", "Role"],
      ...filteredUsers.map((u) => [u.name, u.email, u.role]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users_report.csv";
    a.click();
  };
  const navigate = useNavigate();
  return (
    <div className="report-container">
      <h2>📊 Users Report</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* 📄 Export */}
      <div className="btn-row">
        <button onClick={exportCSV} className="export-btn">
          Export CSV ⬇️
        </button>
        <button onClick={exportPDF} className="export-btn">
          Export PDF 📄
        </button>
      </div>
      {/* 📊 Table */}
      <table className="report-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Reports;