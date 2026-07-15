import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const HRDashboard = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin" && role !== "hr") {
      navigate("/dashboard");
    }
  }, []);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [empRes, attRes, leaveRes, payRes] = await Promise.all([
        fetch("http://localhost:5000/api/employees", { headers }),
        fetch("http://localhost:5000/api/attendance", { headers }),
        fetch("http://localhost:5000/api/leaves", { headers }),
        fetch("http://localhost:5000/api/payroll", { headers })
      ]);

      const [empData, attData, leaveData, payData] = await Promise.all([
        empRes.json(),
        attRes.json(),
        leaveRes.json(),
        payRes.json()
      ]);

      setEmployees(empData);
      setAttendance(attData);
      setLeaves(leaveData);
      setPayrolls(payData);
    } catch (error) {
      console.error("Error loading HR dashboard data:", error);
    }
  };

  const totalEmployees = employees.length;
  const presentToday = attendance.filter((att) => att.status === "Present").length;
  const employeesOnLeave = leaves.filter((leave) => leave.status === "Approved").length;
  const paidPayrolls = payrolls.filter((pay) => pay.status === "Paid").length;

  const departmentMap = {};
  employees.forEach((emp) => {
    const dept = emp.department || "Other";
    departmentMap[dept] = (departmentMap[dept] || 0) + 1;
  });

  const departmentData = Object.keys(departmentMap).map((dept) => ({
    department: dept,
    count: departmentMap[dept]
  }));

  const leaveStatusMap = {};
  leaves.forEach((leave) => {
    const status = leave.status || "Pending";
    leaveStatusMap[status] = (leaveStatusMap[status] || 0) + 1;
  });

  const leaveStatusData = Object.keys(leaveStatusMap).map((status) => ({
    name: status,
    value: leaveStatusMap[status]
  }));

  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  return (
    <MainLayout>
      <PageHeader
        title="HR Analytics Dashboard"
        subtitle="Track employee counts, daily attendance, active leaves, and payroll logs."
        backUrl="/dashboard"
      />

      <div style={{ marginTop: "24px" }}>
        {/* KPI Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            margin: "30px 0"
          }}
        >
          <StatCard title="Total Employees" value={totalEmployees} />
          <StatCard title="Present Today" value={presentToday} />
          <StatCard title="On Leave" value={employeesOnLeave} />
          <StatCard title="Paid Payrolls" value={paidPayrolls} />
        </div>

        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", marginTop: "40px" }}>
          {/* Department Chart */}
          <div className="card" style={{ padding: "20px", flex: "1 1 500px" }}>
            <h2 style={{ marginBottom: "20px" }}>🏢 Department-wise Employees</h2>
            <BarChart width={500} height={300} data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2196F3" />
            </BarChart>
          </div>

          {/* Leave Status Pie Chart */}
          <div className="card" style={{ padding: "20px", flex: "1 1 400px" }}>
            <h2 style={{ marginBottom: "20px" }}>🌴 Leave Status Distribution</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={leaveStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {leaveStatusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Reusable KPI Card
const StatCard = ({ title, value }) => (
  <div
    style={{
      width: "220px",
      padding: "20px",
      borderRadius: "12px",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      textAlign: "center"
    }}
  >
    <h3 style={{ color: "var(--text-muted)", fontSize: "14px", fontWeight: "600", textTransform: "uppercase" }}>{title}</h3>
    <p
      style={{
        fontSize: "36px",
        fontWeight: "bold",
        margin: "10px 0 0",
        color: "var(--text-main)"
      }}
    >
      {value}
    </p>
  </div>
);

export default HRDashboard;