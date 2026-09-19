const Leave = require("../models/leave");
const Employee = require("../models/employee");
const { sendNotification } = require("../../../utils/notify");

// ✅ Apply Leave
const applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    const userRole = (req.user?.role || "").toLowerCase();
    const isHrOrAdmin = ["super admin", "admin", "hr manager"].includes(userRole);

    // Security: Non-admin/HR users can ONLY apply for themselves
    let targetEmployeeId = null;
    let emp = null;

    if (isHrOrAdmin && employeeId) {
      targetEmployeeId = employeeId;
      emp = await Employee.findById(targetEmployeeId);
    } else {
      // Determine employee from authenticated JWT
      if (req.user.employeeDocId) {
        emp = await Employee.findById(req.user.employeeDocId);
      }
      if (!emp && req.user.id) {
        emp = await Employee.findOne({ userId: req.user.id });
      }
      if (!emp) {
        return res.status(404).json({ message: "Employee profile not found for authenticated user." });
      }
      targetEmployeeId = emp._id;
    }

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "Start date, end date, and reason are required" });
    }

    const leave = new Leave({
      employee: targetEmployeeId,
      leaveType: leaveType || "Sick",
      startDate,
      endDate,
      reason,
      status: "Pending"
    });

    await leave.save();

    const populatedLeave = await Leave.findById(leave._id).populate("employee", "employeeId name department");

    // Notify HR
    await sendNotification(req.app.get("io"), {
      role: "hr manager",
      title: "New Leave Request",
      message: `${emp.name} has requested ${leave.leaveType} leave from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`,
      type: "info"
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave: populatedLeave
    });
  } catch (error) {
    console.error("Apply leave error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Authenticated Employee's Leaves (/api/leaves/me)
const getMyLeaves = async (req, res) => {
  try {
    let empId = req.user.employeeDocId;
    if (!empId && req.user.id) {
      const emp = await Employee.findOne({ userId: req.user.id });
      if (emp) empId = emp._id;
    }

    if (!empId) {
      return res.status(200).json([]);
    }

    const leaves = await Leave.find({ employee: empId })
      .populate("employee", "employeeId name department")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error("Get my leaves error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Leave Requests (Role Scoped)
const getLeaves = async (req, res) => {
  try {
    const userRole = (req.user?.role || "").toLowerCase();
    const isHrOrAdmin = ["super admin", "admin", "hr manager", "hr executive"].includes(userRole);

    let filter = {};
    if (!isHrOrAdmin) {
      let empId = req.user.employeeDocId;
      if (!empId && req.user.id) {
        const emp = await Employee.findOne({ userId: req.user.id });
        if (emp) empId = emp._id;
      }
      if (!empId) return res.status(200).json([]);
      filter = { employee: empId };
    }

    const leaves = await Leave.find(filter)
      .populate("employee", "employeeId name department userId")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.error("Get leaves error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Leave Status (Approve / Reject)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Valid status (Approved, Rejected, Pending) is required" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Security Check: User cannot approve their own leave request
    const userEmpId = req.user.employeeDocId?.toString();
    if (userEmpId && leave.employee.toString() === userEmpId) {
      return res.status(403).json({
        message: "Conflict of interest: You cannot approve or reject your own leave request."
      });
    }

    leave.status = status;
    await leave.save();

    const populatedLeave = await Leave.findById(leave._id).populate("employee", "name userId");

    // Notify Employee
    if (populatedLeave.employee && populatedLeave.employee.userId) {
      await sendNotification(req.app.get("io"), {
        userId: populatedLeave.employee.userId,
        title: `Leave Request ${status}`,
        message: `Your leave request for ${new Date(leave.startDate).toLocaleDateString()} has been ${status.toLowerCase()}.`,
        type: status === "Approved" ? "success" : "error"
      });
    }

    res.json({
      message: "Leave status updated successfully",
      leave: populatedLeave
    });
  } catch (error) {
    console.error("Update leave status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getLeaves,
  updateLeaveStatus
};