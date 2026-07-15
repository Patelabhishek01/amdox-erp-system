// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   PieChart,
// //   Pie,
// //   Cell
// // } from "recharts";

// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   const role = localStorage.getItem("role");

// //   const [stats, setStats] = useState([]);

// //   useEffect(() => {
// //     if (!localStorage.getItem("token")) {
// //       navigate("/");
// //     }
// //   }, []);

// //   useEffect(() => {
// //     fetchStats();
// //   }, []);

// //   const fetchStats = async () => {
// //     const token = localStorage.getItem("token");

// //     const res = await fetch("http://localhost:5000/api/users", {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });

// //     const data = await res.json();

// //     const adminCount = data.filter((u) => u.role === "admin").length;
// //     const userCount = data.filter((u) => u.role === "user").length;

// //     setStats([
// //       { name: "Admin", count: adminCount },
// //       { name: "User", count: userCount },
// //     ]);
// //   };

// //   const totalUsers = stats.reduce((a, b) => a + b.count, 0);

// //   const logout = () => {
// //     localStorage.clear();
// //     navigate("/");
// //   };

// //   return (
// //     <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>

// //       {/* Sidebar */}
// //       <div
// //         style={{
// //           width: "250px",
// //           background: "#2c3e50",
// //           color: "white",
// //           padding: "20px",
// //         }}
// //       >
// //         <h2 style={{ marginBottom: "30px" }}>ERP Dashboard</h2>

// //         <SidebarItem title="Dashboard" onClick={() => navigate("/dashboard")} />
// //         <SidebarItem title="Profile" onClick={() => navigate("/profile")} />
// //         <SidebarItem title="Settings" onClick={() => navigate("/settings")} />

// //         {role === "admin" && (
// //           <>
// //             <SidebarItem title="Manage Users" onClick={() => navigate("/users")} />
// //             <SidebarItem title="Reports" onClick={() => navigate("/reports")} />
// //             <SidebarItem title="Employees" onClick={() => navigate("/employees")} />
// //             <SidebarItem title="Attendance" onClick={() => navigate("/attendance")}/>
// //             <SidebarItem title="Leave Management" onClick={() => navigate("/leaves")}/>
// //             <SidebarItem title="Payroll" onClick={() => navigate("/payroll")}/>
// //             <SidebarItem title="HR Dashboard" onClick={() => navigate("/hr-dashboard")}/>
// //             <SidebarItem title="Expenses" onClick={() => navigate("/finance/expenses")}/>
// //             <SidebarItem title="Products" onClick={() => navigate("/inventory/products")}/>
// //             <SidebarItem title="Inventory dashboard" onClick={() => navigate("/inventory-dashboard")}/>
// //           </>
// //         )}

// //         <SidebarItem title="Logout" onClick={logout} />
// //       </div>

// //       {/* Main Content */}
// //       <div style={{ flex: 1, padding: "30px" }}>
// //         <h1 style={{ textAlign: "center" }}>
// //           {role === "admin" ? "Admin Panel 👑" : "User Panel 👤"}
// //         </h1>

// //         {/* Stats Cards */}
// //         <div
// //           style={{
// //             display: "flex",
// //             justifyContent: "center",
// //             gap: "20px",
// //             margin: "30px 0",
// //             flexWrap: "wrap",
// //           }}
// //         >
// //           <StatCard title="Total Users" value={totalUsers} />
// //           <StatCard
// //             title="Admins"
// //             value={stats.find((s) => s.name === "Admin")?.count || 0}
// //           />
// //           <StatCard
// //             title="Users"
// //             value={stats.find((s) => s.name === "User")?.count || 0}
// //           />
// //         </div>

// //         {/* Bar Chart */}
// //         <h2 style={{ textAlign: "center" }}>📊 User Analytics</h2>
// //         <div style={{ display: "flex", justifyContent: "center" }}>
// //           <BarChart width={500} height={300} data={stats}>
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis dataKey="name" />
// //             <YAxis />
// //             <Tooltip />
// //             <Bar dataKey="count" fill="#3498db" />
// //           </BarChart>
// //         </div>

// //         {/* Pie Chart */}
// //         <h2 style={{ textAlign: "center", marginTop: "40px" }}>
// //           🥧 Role Distribution
// //         </h2>
// //         <div style={{ display: "flex", justifyContent: "center" }}>
// //           <PieChart width={400} height={300}>
// //             <Pie
// //               data={stats}
// //               dataKey="count"
// //               nameKey="name"
// //               outerRadius={100}
// //               label
// //             >
// //               <Cell fill="#e74c3c" />
// //               <Cell fill="#2ecc71" />
// //             </Pie>
// //           </PieChart>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // /* Sidebar Item */
// // const SidebarItem = ({ title, onClick }) => (
// //   <div
// //     onClick={onClick}
// //     style={{
// //       padding: "12px 15px",
// //       marginBottom: "10px",
// //       borderRadius: "8px",
// //       cursor: "pointer",
// //       background: "#34495e",
// //     }}
// //   >
// //     {title}
// //   </div>
// // );

// // /* Stat Card */
// // const StatCard = ({ title, value }) => (
// //   <div
// //     style={{
// //       width: "180px",
// //       background: "white",
// //       padding: "20px",
// //       borderRadius: "12px",
// //       boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
// //       textAlign: "center",
// //     }}
// //   >
// //     <h3>{title}</h3>
// //     <p style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</p>
// //   </div>
// // );

// // export default Dashboard;











// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role");

//   const [stats, setStats] = useState([]);

//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       navigate("/");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchStats();
//   }, []);

// const fetchStats = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const role  = localStorage.getItem("role");

//     // ✅ Only fetch if admin — skip for regular users
//     if (role !== "admin") {
//       setStats([
//         { name: "Admin", count: 0 },
//         { name: "User",  count: 0 },
//       ]);
//       return;
//     }

//     if (!token) {
//       navigate("/");
//       return;
//     }

//     const res = await fetch("http://localhost:5000/api/users", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     // ✅ Token expired → redirect to login
//     if (res.status === 401) {
//       localStorage.clear();
//       navigate("/");
//       return;
//     }

//     if (!res.ok) {
//       setStats([
//         { name: "Admin", count: 0 },
//         { name: "User",  count: 0 },
//       ]);
//       return;
//     }

//     const data = await res.json();

//     // ✅ Safety check
//     if (!Array.isArray(data)) {
//       setStats([
//         { name: "Admin", count: 0 },
//         { name: "User",  count: 0 },
//       ]);
//       return;
//     }

//     setStats([
//       { name: "Admin", count: data.filter((u) => u.role === "admin").length },
//       { name: "User",  count: data.filter((u) => u.role === "user").length  },
//     ]);

//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     setStats([
//       { name: "Admin", count: 0 },
//       { name: "User",  count: 0 },
//     ]);
//   }
// };

//   const totalUsers = stats.reduce(
//     (sum, item) => sum + item.count,
//     0
//   );

//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         minHeight: "100vh",
//         background: "#f5f6fa",
//       }}
//     >
//       {/* Sidebar */}
//       <div
//         style={{
//           width: "260px",
//           background: "#2c3e50",
//           color: "white",
//           padding: "20px",
//           overflowY: "auto",
//           boxSizing: "border-box",
//         }}
//       >
//         <h2
//           style={{
//             marginBottom: "30px",
//             fontSize: "32px",
//             fontWeight: "bold",
//           }}
//         >
//           ERP Dashboard
//         </h2>

//         {/* General */}
//         <SidebarSection title="General" />

//         <SidebarItem
//           title="Dashboard"
//           onClick={() => navigate("/dashboard")}
//         />

//         <SidebarItem
//           title="Profile"
//           onClick={() => navigate("/profile")}
//         />

//         <SidebarItem
//           title="Settings"
//           onClick={() => navigate("/settings")}
//         />

//         {role === "admin" && (
//           <>
//             {/* Administration */}
//             <SidebarSection title="Administration" />

//             <SidebarItem
//               title="Manage Users"
//               onClick={() => navigate("/users")}
//             />

//             <SidebarItem
//               title="Reports"
//               onClick={() => navigate("/reports")}
//             />

//             {/* Business Modules */}
//             <SidebarSection title="Modules" />

//             <SidebarItem
//               title="HR Module"
//               onClick={() => navigate("/employees")}
//             />

//             <SidebarItem
//               title="Finance Module"
//               onClick={() =>
//                 navigate("/finance/expenses")
//               }
//             />

//             <SidebarItem
//               title="Inventory Module"
//               onClick={() =>
//                 navigate("/inventory/products")
//               }
//             />

//             <SidebarItem
//               title="Sales Module"
//               onClick={() =>
//                 navigate("/sales/customers")
//               }
//             />

//             <SidebarItem
//               title="Purchase Module"
//               onClick={() =>
//                 navigate("/purchase")
//               }
//             />

//             <SidebarItem
//               title="CRM Module"
//               onClick={() => navigate("/crm")}
//             />

//             <SidebarItem
//               title="Project Module"
//               onClick={() => navigate("/project")}
//             />

//             <SidebarItem
//               title="Help Desk Module"
//               onClick={() => navigate("/helpdesk")}
//             />

//             <SidebarItem
//               title="Asset Module"
//               onClick={() => navigate("/asset")}
//             />

//             <SidebarItem
//               title="Recruitment Module"
//               onClick={() => navigate("/recruitment")}
//             />

//             {/* Analytics */}
//             <SidebarSection title="Analytics" />

//             <SidebarItem
//               title="HR Dashboard"
//               onClick={() =>
//                 navigate("/hr-dashboard")
//               }
//             />

//             <SidebarItem
//               title="Inventory Dashboard"
//               onClick={() =>
//                 navigate(
//                   "/inventory-dashboard"
//                 )
//               }
//             />

//             <SidebarItem
//               title="Sales Dashboard"
//               onClick={() =>
//                 navigate("/sales-dashboard")
//               }
//             />
//             <SidebarItem
//               title="Purchase DashBoard"
//               onClick={()=>
//                 navigate("/purchase-dashboard")
//               }
//             />
//             <SidebarItem
//               title="CRM Dashboard"
//               onClick={() => navigate("/crm-dashboard")}
//             />
//             <SidebarItem
//               title="Project Dashboard"
//               onClick={() => navigate("/project-dashboard")}
//             />
            
//             <SidebarItem
//               title="Help Desk Dashboard"
//               onClick={() => navigate("/helpdesk-dashboard")}
//             />
            
//             <SidebarItem
//               title="Asset Dashboard"
//               onClick={() => navigate("/asset-dashboard")}
//             />

//             <SidebarItem
//               title="Recruitment Dashboard"
//               onClick={() => navigate("/recruitment-dashboard")}
//             />

//           </>
//         )}

//         {/* Account */}
//         <SidebarSection title="Account" />

//         <SidebarItem
//           title="Logout"
//           onClick={logout}
//           danger
//         />
//       </div>

//       {/* Main Content */}
//       <div
//         style={{
//           flex: 1,
//           padding: "30px",
//         }}
//       >
//         <h1
//           style={{
//             textAlign: "center",
//             marginBottom: "30px",
//           }}
//         >
//           {role === "admin"
//             ? "Admin Panel 👑"
//             : "User Panel 👤"}
//         </h1>

//         {/* Stats Cards */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             gap: "20px",
//             margin: "30px 0",
//             flexWrap: "wrap",
//           }}
//         >
//           <StatCard
//             title="Total Users"
//             value={totalUsers}
//           />

//           <StatCard
//             title="Admins"
//             value={
//               stats.find(
//                 (s) => s.name === "Admin"
//               )?.count || 0
//             }
//           />

//           <StatCard
//             title="Users"
//             value={
//               stats.find(
//                 (s) => s.name === "User"
//               )?.count || 0
//             }
//           />
//         </div>

//         {/* Bar Chart */}
//         <h2 style={{ textAlign: "center" }}>
//           📊 User Analytics
//         </h2>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <BarChart
//             width={500}
//             height={300}
//             data={stats}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar
//               dataKey="count"
//               fill="#3498db"
//             />
//           </BarChart>
//         </div>

//         {/* Pie Chart */}
//         <h2
//           style={{
//             textAlign: "center",
//             marginTop: "40px",
//           }}
//         >
//           🥧 Role Distribution
//         </h2>

//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//           <PieChart width={400} height={300}>
//             <Pie
//               data={stats}
//               dataKey="count"
//               nameKey="name"
//               outerRadius={100}
//               label
//             >
//               <Cell fill="#e74c3c" />
//               <Cell fill="#2ecc71" />
//             </Pie>
//           </PieChart>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* Sidebar Section Heading */
// const SidebarSection = ({ title }) => (
//   <div
//     style={{
//       marginTop: "24px",
//       marginBottom: "10px",
//       paddingLeft: "4px",
//       fontSize: "12px",
//       fontWeight: "bold",
//       textTransform: "uppercase",
//       letterSpacing: "1px",
//       color: "#9fb3c8",
//     }}
//   >
//     {title}
//   </div>
// );

// /* Sidebar Item */
// const SidebarItem = ({
//   title,
//   onClick,
//   danger = false,
// }) => (
//   <div
//     onClick={onClick}
//     style={{
//       padding: "12px 15px",
//       marginBottom: "10px",
//       borderRadius: "8px",
//       cursor: "pointer",
//       background: danger
//         ? "#7f1d1d"
//         : "#34495e",
//       transition: "0.2s",
//       userSelect: "none",
//     }}
//     onMouseEnter={(e) => {
//       e.currentTarget.style.background = danger
//         ? "#991b1b"
//         : "#3f5873";
//     }}
//     onMouseLeave={(e) => {
//       e.currentTarget.style.background = danger
//         ? "#7f1d1d"
//         : "#34495e";
//     }}
//   >
//     {title}
//   </div>
// );

// /* Stat Card */
// const StatCard = ({ title, value }) => (
//   <div
//     style={{
//       width: "180px",
//       background: "white",
//       padding: "20px",
//       borderRadius: "12px",
//       boxShadow:
//         "0 2px 8px rgba(0,0,0,0.1)",
//       textAlign: "center",
//     }}
//   >
//     <h3>{title}</h3>
//     <p
//       style={{
//         fontSize: "24px",
//         fontWeight: "bold",
//       }}
//     >
//       {value}
//     </p>
//   </div>
// );

// export default Dashboard;





















import { useState, useEffect } from "react";
import {
  FaUsers,
  FaWallet,
  FaBoxes,
  FaShoppingCart,
} from "react-icons/fa";

import MainLayout from "../../component/layouts/MainLayout";
import KPICard from "../../component/ui/KPICard";
import DataTable from "../../component/ui/DataTable";
import StatusBadge from "../../component/ui/StatusBadge";
import { apiRequest } from "../../utils/api";

const recentOrders = [
  {
    orderId: "SO-1001",
    customer: "Acme Corporation",
    amount: "$12,500",
    status: "Completed",
  },
  {
    orderId: "SO-1002",
    customer: "Global Tech Ltd.",
    amount: "$8,750",
    status: "Pending",
  },
  {
    orderId: "SO-1003",
    customer: "Prime Solutions",
    amount: "$15,200",
    status: "In Progress",
  },
  {
    orderId: "SO-1004",
    customer: "Vision Enterprises",
    amount: "$5,900",
    status: "Cancelled",
  },
];

const columns = [
  { key: "orderId", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  {
    key: "status",
    label: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
];

export default function Dashboard() {
  const role = (localStorage.getItem("role") || "employee").toLowerCase();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    if (role !== "admin") return;
    try {
      setLoadingUsers(true);
      const res = await apiRequest("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Error fetching users on dashboard:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userRecord) => {
    const nextStatus = !userRecord.active;
    const confirmMsg = nextStatus 
      ? `Approve user account for ${userRecord.email}?`
      : `Deactivate user account for ${userRecord.email}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await apiRequest(`/api/users/${userRecord._id}`, {
        method: "PUT",
        body: JSON.stringify({ active: nextStatus })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error toggling status");
    }
  };

  return (
    <MainLayout>
      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Total Employees"
          value="248"
          icon={<FaUsers />}
          change="12.5%"
          trend="up"
        />

        <KPICard
          title="Monthly Revenue"
          value="$185,400"
          icon={<FaWallet />}
          change="8.2%"
          trend="up"
        />

        <KPICard
          title="Inventory Items"
          value="3,426"
          icon={<FaBoxes />}
          change="2.1%"
          trend="up"
        />

        <KPICard
          title="Sales Orders"
          value="154"
          icon={<FaShoppingCart />}
          change="4.7%"
          trend="down"
          placeholder=""
        />
      </div>

      {/* Charts Placeholder */}
      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h3>Revenue Overview</h3>
          </div>
          <div className="chart-placeholder">
            Revenue chart will be integrated here.
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Department Summary</h3>
          </div>
          <div className="chart-placeholder">
            Department chart will be integrated here.
          </div>
        </div>
      </div>

      {/* Admin User Approvals Section */}
      {role === "admin" && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <div className="card-header">
            <h3>User Access & Registration Approvals</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loadingUsers ? (
                <div style={{ padding: "20px", textAlign: "center" }}>Loading login accounts...</div>
              ) : users.length === 0 ? (
                <div className="empty-state">No users registered in the system.</div>
              ) : (
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email (Domain)</th>
                      <th>Assigned Role</th>
                      <th>Status</th>
                      <th>Approval Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: "700" }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span style={{
                            textTransform: "uppercase",
                            fontSize: "11px",
                            fontWeight: "600",
                            background: "#e2e8f0",
                            padding: "3px 8px",
                            borderRadius: "4px"
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span style={{
                            fontWeight: "700",
                            color: u.active ? "#16a34a" : "#dc2626",
                            background: u.active ? "#dcfce7" : "#fee2e2",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "11px"
                          }}>
                            {u.active ? "Active" : "Pending Approval"}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => toggleUserStatus(u)}
                            style={{
                              background: u.active ? "#ef4444" : "#3b82f6",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "12px",
                              transition: "background 0.2s"
                            }}
                          >
                            {u.active ? "Deactivate / Disable" : "Approve Account ✅"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <DataTable
        title="Recent Sales Orders"
        columns={columns}
        data={recentOrders}
      />
    </MainLayout>
  );
}