const Task = require("../models/Task");

// Create/Assign Task
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedEmployeeId, hoursLogged, status } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required" });
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedEmployeeId: assignedEmployeeId || null,
      hoursLogged: hoursLogged || 0,
      status: status || "Todo"
    });

    await task.save();

    res.status(201).json({
      message: "Task assigned/created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Log Hours worked on Task
const logHours = async (req, res) => {
  try {
    const { hours } = req.body;

    if (hours === undefined || Number(hours) <= 0) {
      return res.status(400).json({ message: "Hours to log must be a positive number" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.hoursLogged = (task.hoursLogged || 0) + Number(hours);
    await task.save();

    res.json({
      message: `${hours} hours logged successfully on task`,
      task
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Tasks (with optional filtering)
const getTasks = async (req, res) => {
  try {
    const { projectId, assignedEmployeeId } = req.query;
    const filter = {};

    if (projectId) filter.projectId = projectId;
    if (assignedEmployeeId) filter.assignedEmployeeId = assignedEmployeeId;

    const tasks = await Task.find(filter)
      .populate("projectId")
      .populate("assignedEmployeeId")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Tasks by Employee ID
const getTasksByEmployee = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedEmployeeId: req.params.employeeId })
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  logHours,
  getTasks,
  getTasksByEmployee
};
