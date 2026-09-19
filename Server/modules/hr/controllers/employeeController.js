const Employee = require("../models/employee");
const Notification = require("../../../models/Notification");
const { logAudit } = require("../../../utils/auditLogger");

// ✅ CREATE EMPLOYEE
const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    
    // If not Admin (e.g. HR), force status to "Pending Approval"
    const userRole = (req.user && req.user.role) ? req.user.role.toLowerCase() : "";
    const isAdmin = ["super admin", "admin"].includes(userRole);
    if (!isAdmin) {
      employee.status = "Pending Approval";
    }

    await employee.save();

    await logAudit(req, "Create Employee", "HR", `Created employee ${employee.name} (ID: ${employee.employeeId})`);

    // If it was created as Pending Approval, notify the Admin
    if (!isAdmin) {
      try {
        const notif = new Notification({
          title: "Employee Approval Request",
          message: `HR user ${req.user.name || "HR"} requested approval to add employee ${employee.name} (ID: ${employee.employeeId}).`,
          type: "warning"
        });
        await notif.save();
      } catch (err) {
        console.error("Error creating approval notification:", err);
      }
    }

    res.status(201).json({
      message: isAdmin 
        ? "Employee created successfully" 
        : "Employee creation request submitted to Admin for approval",
      employee
    });
  } catch (error) {
    console.log(error);

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Employee ID or Email already exists"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
};


// ✅ GET LOGGED IN EMPLOYEE PROFILE
const getMyEmployeeProfile = async (req, res) => {
  try {
    let employee = null;
    if (req.user.employeeDocId) {
      employee = await Employee.findById(req.user.employeeDocId).populate("userId", "email role profilePhoto");
    }
    if (!employee && req.user.id) {
      employee = await Employee.findOne({ userId: req.user.id }).populate("userId", "email role profilePhoto");
    }

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Get my employee profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ GET ALL EMPLOYEES
const getEmployees = async (req, res) => {
  try {
    const userRole = (req.user?.role || "").toLowerCase();
    const isHrOrAdmin = ["super admin", "admin", "hr manager", "hr executive"].includes(userRole);

    let query = Employee.find().sort({ createdAt: -1 });

    // If caller is NOT HR or Admin (e.g. Project Manager), hide sensitive compensation and banking info
    if (!isHrOrAdmin) {
      query = query.select("-salary -bankDetails");
    }

    const employees = await query.exec();
    res.json(employees);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// ✅ GET SINGLE EMPLOYEE
const getEmployeeById = async (req, res) => {
  try {
    const userRole = (req.user?.role || "").toLowerCase();
    const isHrOrAdmin = ["super admin", "admin", "hr manager", "hr executive"].includes(userRole);

    let query = Employee.findById(req.params.id);
    if (!isHrOrAdmin) {
      query = query.select("-salary -bankDetails");
    }

    const employee = await query.exec();

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    res.json(employee);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// ✅ UPDATE EMPLOYEE
const updateEmployee = async (req, res) => {
  try {
    const userRole = (req.user?.role || "").toLowerCase();
    const isAdmin = ["super admin", "admin"].includes(userRole);

    // Prevent non-admins from altering sensitive operational fields
    const updates = { ...req.body };
    if (!isAdmin) {
      delete updates.salary;
      delete updates.userId;
      delete updates.employeeId;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    await logAudit(req, "Update Employee", "HR", `Updated employee ${employee.name} (ID: ${employee.employeeId})`);

    res.json({
      message: "Employee updated successfully",
      employee
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// ✅ DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    await logAudit(req, "Delete Employee", "HR", `Deleted employee ${employee.name} (ID: ${employee.employeeId})`);

    res.json({
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createEmployee,
  getEmployees,
  getMyEmployeeProfile,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};