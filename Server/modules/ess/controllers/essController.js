const Employee = require("../../hr/models/employee");
const Leave = require("../../hr/models/leave");
const Attendance = require("../../hr/models/attendance");
const Payroll = require("../../hr/models/payroll");
const Task = require("../../project/models/Task");
const Project = require("../../project/models/Project");
const Ticket = require("../../helpdesk/models/Ticket");
const Asset = require("../../asset/models/Asset");

const User = require("../../auth/models/user");

// Helper to get Employee document for current user
const getEmployee = async (userId, employeeDocId) => {
  if (employeeDocId) {
    const emp = await Employee.findById(employeeDocId);
    if (emp) return emp;
  }
  let emp = await Employee.findOne({ userId });
  if (!emp && userId) {
    const user = await User.findById(userId);
    if (user && user.email) {
      emp = await Employee.findOne({ email: { $regex: `^${user.email.trim()}$`, $options: "i" } });
    }
    if (!emp && user && user.name) {
      emp = await Employee.findOne({ name: { $regex: `^${user.name.trim()}$`, $options: "i" } });
    }
    if (emp && !emp.userId) {
      emp.userId = userId;
      await emp.save().catch(() => {});
    }
  }
  return emp;
};

// Comprehensive Employee Self-Service Dashboard Data
const getDashboardData = async (req, res) => {
  try {
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });

    // 1. Fetch assigned projects
    const projects = await Project.find({
      $or: [
        { projectManager: employee._id },
        { teamMembers: employee._id },
        { assignedTo: employee._id }
      ]
    })
      .populate("projectManager", "name email department designation")
      .select("projectName priority status dueDate projectManager description createdAt")
      .sort("-createdAt");

    // 2. Fetch assigned tasks
    const tasks = await Task.find({ assignedEmployeeId: employee._id })
      .populate("projectId", "projectName status dueDate priority")
      .sort("-createdAt");

    // 3. Fetch leave requests
    const leaves = await Leave.find({ employee: employee._id })
      .sort("-createdAt")
      .limit(10);

    // 4. Calculate KPI statistics
    const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
    const approvedLeaves = leaves.filter(l => l.status === "Approved").length;
    const pendingTasks = tasks.filter(t => t.status !== "Done").length;
    const completedTasks = tasks.filter(t => t.status === "Done").length;
    const totalProjects = projects.length;

    res.status(200).json({
      employeeInfo: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        department: employee.department,
        designation: employee.designation,
        role: req.user.role || "Employee",
        joiningDate: employee.joiningDate,
        status: employee.status
      },
      projects,
      tasks,
      leaves,
      stats: {
        totalProjects,
        pendingTasks,
        completedTasks,
        pendingLeaves,
        approvedLeaves
      }
    });
  } catch (error) {
    console.error("Error fetching ESS dashboard data:", error);
    res.status(500).json({ message: "Error fetching ESS dashboard data", error: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee profile not found" });
    res.status(200).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Leave Management
const getMyLeaves = async (req, res) => {
  try {
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const leaves = await Leave.find({ employee: employee._id }).sort("-createdAt");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const newLeave = new Leave({
      employee: employee._id,
      leaveType: leaveType || "Sick",
      startDate,
      endDate,
      reason,
      status: "Pending"
    });
    await newLeave.save();

    // Trigger Notification for HR Manager
    const Notification = require("../../../models/Notification");
    const notif = new Notification({
      title: "New Leave Application",
      message: `${employee.name} applied for ${newLeave.leaveType} leave.`,
      role: "HR Manager"
    });
    await notif.save();
    const io = req.app.get("io");
    if (io) io.emit("notification", notif);

    res.status(201).json({ message: "Leave applied successfully", leave: newLeave });
  } catch (error) {
    res.status(500).json({ message: "Error applying leave" });
  }
};

const cancelLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const leave = await Leave.findOne({ _id: leaveId, employee: employee._id });
    if (!leave) return res.status(404).json({ message: "Leave record not found" });
    if (leave.status !== "Pending") return res.status(400).json({ message: "Only pending leaves can be cancelled" });

    await Leave.deleteOne({ _id: leaveId });
    res.status(200).json({ message: "Leave cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling leave" });
  }
};

// Attendance
const getMyAttendance = async (req, res) => {
  try {
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const records = await Attendance.find({ employee: employee._id }).sort("-date");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

const checkIn = async (req, res) => {
  res.status(200).json({ message: "Checked in successfully (Mock)" });
};

const checkOut = async (req, res) => {
  res.status(200).json({ message: "Checked out successfully (Mock)" });
};

// Payroll
const getMyPayroll = async (req, res) => {
  try {
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const payrolls = await Payroll.find({ employee: employee._id }).sort("-createdAt");
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll" });
  }
};

// Tasks
const getMyTasks = async (req, res) => {
  try {
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const tasks = await Task.find({ assignedEmployeeId: employee._id }).populate("projectId", "projectName status dueDate priority");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// Tickets
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ raisedByUserId: req.user.id }).sort("-createdAt");
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

const raiseTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const newTicket = new Ticket({
      ticketId: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      raisedByUserId: req.user.id,
      title,
      description,
      priority
    });
    await newTicket.save();
    res.status(201).json({ message: "Ticket raised successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Error raising ticket" });
  }
};

// Assets
const getMyAssets = async (req, res) => {
  try {
    const employee = await getEmployee(req.user.id, req.user.employeeDocId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const assets = await Asset.find({ assignedTo: employee._id });
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned assets" });
  }
};

module.exports = {
  getDashboardData,
  getMyProfile,
  getMyLeaves,
  applyLeave,
  cancelLeave,
  getMyAttendance,
  checkIn,
  checkOut,
  getMyPayroll,
  getMyTasks,
  getMyTickets,
  raiseTicket,
  getMyAssets
};
