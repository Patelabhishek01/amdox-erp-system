import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Reports.css";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import { apiRequest } from "../../utils/api";

const Reports = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await apiRequest("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users for report:", err);
    }
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

    doc.save("users-report.pdf");
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "#,Name,Email,Role\n";

    filteredUsers.forEach((u, index) => {
      csvContent += `${index + 1},${u.name},${u.email},${u.role}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        subtitle="Download or view detailed user role reports in PDF or CSV formats."
        backUrl="/dashboard"
      />

      <div style={{ marginTop: "24px" }}>
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
      </div>
    </MainLayout>
  );
};

export default Reports;