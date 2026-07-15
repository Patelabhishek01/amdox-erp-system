const Payroll = require("../models/payroll");
const Employee = require("../models/employee");
const Transaction = require("../../finance/models/Transaction");

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

// Process Bulk Monthly Payroll
const processPayroll = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    // 1. Fetch active employees
    const activeEmployees = await Employee.find({ status: "Active" });
    if (activeEmployees.length === 0) {
      return res.status(400).json({ message: "No active employees found to process payroll for" });
    }

    let totalPayrollAmount = 0;
    const processedPayrolls = [];

    // 2. Loop and generate Payroll records
    for (const employee of activeEmployees) {
      const basicSalary = employee.salary || employee.baseSalary || 0;
      const bonus = 0;
      const deductions = 0;
      const netSalary = basicSalary + bonus - deductions;

      // Check if payroll already processed for this employee, month, and year
      const existing = await Payroll.findOne({
        employee: employee._id,
        month,
        year
      });

      if (!existing) {
        const payroll = new Payroll({
          employee: employee._id,
          basicSalary,
          bonus,
          deductions,
          netSalary,
          status: "Paid", // Automatically marked paid for bulk run
          paymentDate: Date.now(),
          month,
          year
        });
        await payroll.save();
        processedPayrolls.push(payroll);
        totalPayrollAmount += netSalary;
      }
    }

    if (processedPayrolls.length === 0) {
      return res.status(400).json({ message: "Payroll already processed for all active employees for this period" });
    }

    // 3. Log a Debit transaction in Finance Central ledger
    let transaction;
    try {
      transaction = await Transaction.create({
        sourceModule: "HR",
        type: "Debit",
        amount: totalPayrollAmount,
        referenceId: processedPayrolls[0]._id, // Use the first processed payroll record as reference
        date: Date.now()
      });
    } catch (finError) {
      console.error("Failed to automatically log payroll expense in Finance ledger:", finError);
    }

    res.status(201).json({
      message: `Payroll processed successfully for ${processedPayrolls.length} employees. Total expense of $${totalPayrollAmount} recorded in Finance ledger.`,
      payrolls: processedPayrolls,
      transaction
    });
  } catch (error) {
    console.error("Payroll processing error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPayroll,
  getPayrolls,
  updatePayrollStatus,
  deletePayroll,
  processPayroll,
};