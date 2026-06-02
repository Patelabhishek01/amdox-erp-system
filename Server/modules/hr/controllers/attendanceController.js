const Attendance = require("../models/attendance");

// ✅ Mark Attendance
const markAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
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
    const records = await Attendance.find()
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