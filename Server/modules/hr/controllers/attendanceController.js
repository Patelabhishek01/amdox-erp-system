const Attendance = require("../models/attendance");

const Employee = require("../models/employee");

// ✅ Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;
    
    let targetEmployeeId = employeeId;
    if (!targetEmployeeId) {
      const emp = await Employee.findOne({ userId: req.user.id });
      if (!emp) return res.status(404).json({ message: "Employee profile not found." });
      targetEmployeeId = emp._id;
    }

    const attendanceData = {
      employee: targetEmployeeId,
      date,
      status
    };

    const attendance = new Attendance(attendanceData);
    await attendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance
    });
  } catch (error) {
    console.log(error);

    // Duplicate entry handling (optional if later unique index is added)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance for this employee and date already exists"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
};

// ✅ Get All Attendance Records
const getAttendance = async (req, res) => {
  try {
    const userRole = (req.user.role || "").toLowerCase();
    
    let filter = {};
    if (!["super admin", "admin", "hr manager", "hr executive"].includes(userRole)) {
      const emp = await Employee.findOne({ userId: req.user.id });
      if (!emp) return res.status(404).json({ message: "Employee profile not found." });
      filter = { employee: emp._id };
    }

    const records = await Attendance.find(filter)
      .populate("employee", "employeeId name department")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance
};