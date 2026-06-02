const Leave = require("../models/leave");

// ✅ Apply Leave
const applyLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();

    res.status(201).json({
      message: "Leave applied successfully",
      leave
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// ✅ Get All Leave Requests
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "employeeId name department")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// ✅ Update Leave Status (Approve / Reject)
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    res.json({
      message: "Leave status updated successfully",
      leave
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  applyLeave,
  getLeaves,
  updateLeaveStatus
};