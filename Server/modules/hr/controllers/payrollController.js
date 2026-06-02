const Payroll = require("../models/payroll");

// Create Payroll
const createPayroll = async (req, res) => {
  try {
    const { basicSalary, bonus, deductions } = req.body;

    const netSalary =
      Number(basicSalary) + Number(bonus || 0) - Number(deductions || 0);

    const payroll = new Payroll({
      ...req.body,
      netSalary,
    });

    await payroll.save();

    res.status(201).json({
      message: "Payroll created successfully",
      payroll,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Payroll Records
const getPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "employeeId name department designation")
      .sort({ createdAt: -1 });

    res.json(payrolls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Payment Status
const updatePayrollStatus = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    res.json({
      message: "Payroll status updated successfully",
      payroll,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Payroll
const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    res.json({ message: "Payroll deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPayroll,
  getPayrolls,
  updatePayrollStatus,
  deletePayroll,
};