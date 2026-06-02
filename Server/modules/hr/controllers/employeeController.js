const Employee = require("../models/employee");


// ✅ CREATE EMPLOYEE
const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
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


// ✅ GET ALL EMPLOYEES
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
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
    const employee = await Employee.findById(req.params.id);

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
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

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
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};