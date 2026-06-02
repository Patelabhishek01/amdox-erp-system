const Customer = require("../models/Customer");

// Get all customers
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({
      createdAt: -1,
    });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one customer by ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create customer
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(
      req.body
    );

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const customer =
      await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const customer =
      await Customer.findByIdAndDelete(
        req.params.id
      );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message:
        "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};