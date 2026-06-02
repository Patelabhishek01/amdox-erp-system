// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Employees = () => {
//   const navigate = useNavigate();
// const [search, setSearch] = useState("");
//   const [formData, setFormData] = useState({
//     employeeId: "",
//     name: "",
//     email: "",
//     department: "",
//     designation: "",
//     salary: "",
//     joiningDate: "",
//     status: "Active"
//   });

//   const [editingEmployeeId, setEditingEmployeeId] = useState(null);
// const [isEditing, setIsEditing] = useState(false);
//   const [employees, setEmployees] = useState([]);

//   // Fetch all employees on page load
//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const filteredEmployees = employees.filter((employee) =>
//   employee.name.toLowerCase().includes(search.toLowerCase()) ||
//   employee.email.toLowerCase().includes(search.toLowerCase()) ||
//   employee.department.toLowerCase().includes(search.toLowerCase())
// );

//   // Load employee list
//   const fetchEmployees = async () => {
//     const token = localStorage.getItem("token");

//     const res = await fetch("http://localhost:5000/api/employees", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });

//     const data = await res.json();
//     setEmployees(data);
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // Create employee
//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const token = localStorage.getItem("token");

//     // 🔥 Decide Create or Update
//     const url = isEditing
//       ? `http://localhost:5000/api/employees/${editingEmployeeId}`
//       : "http://localhost:5000/api/employees";

//     const method = isEditing ? "PUT" : "POST";

//     // 🔥 API Call
//     const res = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(formData)
//     });

//     const data = await res.json();

//     console.log("Status:", res.status);
//     console.log("Response:", data);

//     if (!res.ok) {
//       alert(data.message || "Failed to save employee");
//       return;
//     }

//     // ✅ Success message
//     alert(
//       isEditing
//         ? "Employee updated successfully"
//         : "Employee saved successfully"
//     );

//     // 🔄 Refresh employee list
//     await fetchEmployees();

//     // 🧹 Clear form
//     setFormData({
//       employeeId: "",
//       name: "",
//       email: "",
//       department: "",
//       designation: "",
//       salary: "",
//       joiningDate: "",
//       status: "Active"
//     });

//     // 🔁 Exit edit mode
//     setIsEditing(false);
//     setEditingEmployeeId(null);

//   } catch (error) {
//     console.log("Submit Error:", error);
//     alert("Something went wrong");
//   }
// };

// const deleteEmployee = async (id) => {
//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this employee?"
//   );

//   if (!confirmDelete) return;

//   const token = localStorage.getItem("token");

//   const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   });

//   const data = await res.json();
//   alert(data.message);

//   // Refresh list
//   fetchEmployees();
// };

// const editEmployee = (employee) => {
//   setFormData({
//     employeeId: employee.employeeId,
//     name: employee.name,
//     email: employee.email,
//     department: employee.department,
//     designation: employee.designation,
//     salary: employee.salary,
//     joiningDate: employee.joiningDate
//       ? employee.joiningDate.split("T")[0]
//       : "",
//     status: employee.status
//   });

//   setEditingEmployeeId(employee._id);
//   setIsEditing(true);

//   window.scrollTo({
//     top: 0,
//     behavior: "smooth"
//   });
// };

//   // Logout
//   const logout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       {/* Navigation */}
//       <div style={{ marginBottom: "20px" }}>
//         <button onClick={() => navigate("/dashboard")}>
//           ⬅ Back to Dashboard
//         </button>

//       </div>

//       <h1>👨Search Employee</h1>
    
//       <input
//         type="text"
//         placeholder="Search by name, email, or department..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         style={{
//             width: "100%",
//             padding: "10px",
//             margin: "15px 0",
//             borderRadius: "6px",
//             border: "1px solid #ccc"
//         }}
//         />
//     <h1>👨‍💼 Add Employee Management</h1>
//       {/* Employee Form */}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="employeeId"
//           placeholder="Employee ID"
//           value={formData.employeeId}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="text"
//           name="department"
//           placeholder="Department"
//           value={formData.department}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="text"
//           name="designation"
//           placeholder="Designation"
//           value={formData.designation}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="number"
//           name="salary"
//           placeholder="Salary"
//           value={formData.salary}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="date"
//           name="joiningDate"
//           value={formData.joiningDate}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <select
//           name="status"
//           value={formData.status}
//           onChange={handleChange}
//         >
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>
//         <br /><br />

//         <button type="submit">
//         {isEditing ? "Update Employee" : "Save Employee"}
//         </button>
//       </form>

//       <hr />

//       {/* Employee List */}
//       <h2>Employees List</h2>

//       <table border="1" cellPadding="10">
//         <thead>
//           <tr>
//             <th>Employee ID</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th>Designation</th>
//             <th>Salary</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredEmployees.map((employee) => (
//             <tr key={employee._id}>
//               <td>{employee.employeeId}</td>
//               <td>{employee.name}</td>
//               <td>{employee.email}</td>
//               <td>{employee.department}</td>
//               <td>{employee.designation}</td>
//               <td>{employee.salary}</td>
//               <td>{employee.status}</td>
//               <td>
//                 <button
//                     onClick={() => deleteEmployee(employee._id)}
//                     style={{
//                     background: "red",
//                     color: "white",
//                     border: "none",
//                     padding: "3px 6px",
//                     borderRadius: "4px",
//                     cursor: "pointer"
//                     }}
//                 >
//                     Delete ❌
//                 </button>
//                 <button
//                     onClick={() => editEmployee(employee)}
//                     style={{
//                         background: "#3498db",
//                         color: "white",
//                         border: "none",
//                         padding: "6px 10px",
//                         borderRadius: "4px",
//                         cursor: "pointer",
//                         marginRight: "5px"
//                     }}
//                     >
//                     Edit ✏️
//                     </button>
//                 </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Employees;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HRSubNav from "./components/HRSubNav";
import MainLayout from "../../component/layouts/MainLayout";
import PageHeader from "../../component/ui/PageHeader";
import StatusBadge from "../../component/ui/StatusBadge";

const Employees = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    status: "Active",
  });

  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [employees, setEmployees] = useState([]);

  /* =========================
     Load Employees
  ========================= */
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  /* =========================
     Search Filter
  ========================= */
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase()) ||
    employee.department.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     Form Handling
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     Create / Update Employee
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const url = isEditing
        ? `http://localhost:5000/api/employees/${editingEmployeeId}`
        : "http://localhost:5000/api/employees";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save employee");
        return;
      }

      alert(
        isEditing
          ? "Employee updated successfully"
          : "Employee saved successfully"
      );

      await fetchEmployees();

      setFormData({
        employeeId: "",
        name: "",
        email: "",
        department: "",
        designation: "",
        salary: "",
        joiningDate: "",
        status: "Active",
      });

      setIsEditing(false);
      setEditingEmployeeId(null);
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Something went wrong");
    }
  };

  /* =========================
     Delete Employee
  ========================= */
  const deleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/employees/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      alert(data.message);

      fetchEmployees();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  /* =========================
     Edit Employee
  ========================= */
  const editEmployee = (employee) => {
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      salary: employee.salary,
      joiningDate: employee.joiningDate
        ? employee.joiningDate.split("T")[0]
        : "",
      status: employee.status,
    });

    setEditingEmployeeId(employee._id);
    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     Logout
  ========================= */
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <MainLayout>
      <HRSubNav />
      <PageHeader
        title="Employees"
        subtitle="Manage employee records and information"
        actionText={isEditing ? "Editing Employee" : "Add Employee"}
        onAction={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      />

      {/* Search */}
      <div className="card">
        <div className="card-header">
          <h3>Search Employees</h3>
        </div>

        <div className="card-body">
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Employee Form */}
      <div className="card">
        <div className="card-header">
          <h3>
            {isEditing ? "Update Employee" : "Add Employee"}
          </h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="form-grid">
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="form-input"
            />

            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              required
              className="form-input"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
              >
                {isEditing
                  ? "Update Employee"
                  : "Save Employee"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingEmployeeId(null);
                    setFormData({
                      employeeId: "",
                      name: "",
                      email: "",
                      department: "",
                      designation: "",
                      salary: "",
                      joiningDate: "",
                      status: "Active",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Employee List */}
      <div className="card">
        <div className="card-header">
          <h3>Employee Directory</h3>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.employeeId}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>{employee.salary}</td>
                    <td>
                      <StatusBadge
                        status={employee.status}
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() =>
                            editEmployee(employee)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteEmployee(employee._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="empty-state"
                  >
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Employees;