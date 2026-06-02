import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    if (role !== "admin") {
        navigate("/dashboard");
    }
    }, []);
  const fetchAllData = async () => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const [
      employeesRes,
      attendanceRes,
      leavesRes,
      payrollsRes
    ] = await Promise.all([
      fetch("http://localhost:5000/api/employees", { headers }),
      fetch("http://localhost:5000/api/attendance", { headers }),
      fetch("http://localhost:5000/api/leaves", { headers }),
      fetch("http://localhost:5000/api/payrolls", { headers })
    ]);

    const employeesData = await employeesRes.json();
    const attendanceData = await attendanceRes.json();
    const leavesData = await leavesRes.json();
    const payrollsData = await payrollsRes.json();

    setEmployees(Array.isArray(employeesData) ? employeesData : []);
    setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
    setLeaves(Array.isArray(leavesData) ? leavesData : []);
    setPayrolls(Array.isArray(payrollsData) ? payrollsData : []);
  };

  // KPI Data
  const totalEmployees = employees.length;
  const presentToday = attendance.filter(
    (a) => a.status === "Present"
  ).length;
  const employeesOnLeave = leaves.filter(
    (l) => l.status === "Approved"
  ).length;
  const paidPayrolls = payrolls.filter(
    (p) => p.status === "Paid"
  ).length;

  // Department-wise employee count
  const departmentMap = {};
  employees.forEach((emp) => {
    const dept = emp.department || "Unknown";
    departmentMap[dept] = (departmentMap[dept] || 0) + 1;
  });

  const departmentData = Object.keys(departmentMap).map((dept) => ({
    department: dept,
    count: departmentMap[dept]
  }));

  // Leave status data
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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {/* Back Button */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <h1>📊 HR Analytics Dashboard</h1>

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

      {/* Department Chart */}
      <h2>🏢 Department-wise Employees</h2>
      <BarChart width={700} height={300} data={departmentData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#2196F3" />
      </BarChart>

      {/* Leave Status Pie Chart */}
      <h2 style={{ marginTop: "40px" }}>🌴 Leave Status Distribution</h2>
      <PieChart width={500} height={350}>
        <Pie
          data={leaveStatusData}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
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
  );
};

// Reusable KPI Card
const StatCard = ({ title, value }) => (
  <div
    style={{
      width: "220px",
      padding: "20px",
      borderRadius: "12px",
      background: "#f5f5f5",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      textAlign: "center"
    }}
  >
    <h3>{title}</h3>
    <p
      style={{
        fontSize: "28px",
        fontWeight: "bold",
        margin: "10px 0 0"
      }}
    >
      {value}
    </p>
  </div>
);

export default HRDashboard;