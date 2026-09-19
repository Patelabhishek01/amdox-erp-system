const Task = require("../models/Task");
const Project = require("../models/Project");
const Employee = require("../../hr/models/employee");
const Leave = require("../../hr/models/leave");
const User = require("../../auth/models/user");
const Notification = require("../../../models/Notification");
const { sendNotification } = require("../../../utils/notify");

// Helper: Notify task assignee
const notifyTaskAssignee = async (io, taskTitle, projectId, assignedEmployeeId, triggeringUserId) => {
  if (!assignedEmployeeId) return;

  try {
    const empDoc = await Employee.findById(assignedEmployeeId);
    if (!empDoc) return;

    let user = await User.findOne({
      $or: [
        { _id: empDoc.userId },
        { employee: empDoc._id },
        { email: { $regex: `^${(empDoc.email || "").trim()}$`, $options: "i" } }
      ]
    });

    if (!user) return;

    const project = await Project.findById(projectId);
    const projName = project ? project.projectName : "Project";

    // Deduplication check
    const existingNotif = await Notification.findOne({
      userId: user._id,
      title: "New Task Assigned",
      message: { $regex: taskTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
    });

    if (existingNotif) return;

    await sendNotification(io, {
      userId: user._id,
      title: "New Task Assigned",
      message: `New task assigned: ${taskTitle}\nProject: ${projName}`,
      type: "info"
    });
  } catch (err) {
    console.error("Error sending task notification:", err);
  }
};

// Helper: Validate team membership, auto-add to team, and check leave availability
const validateTaskAssignment = async (projectId, assignedEmployeeId, targetDueDate, io, triggeringUserId) => {
  if (!assignedEmployeeId) return null; // Unassigned task is allowed

  const project = await Project.findById(projectId);
  if (!project) {
    return { status: 404, message: "Project not found" };
  }

  // 1. Team Membership Check & Auto-addition if missing
  const isManager = project.projectManager && project.projectManager.toString() === assignedEmployeeId.toString();
  const isMember = project.teamMembers && project.teamMembers.some(id => id.toString() === assignedEmployeeId.toString());
  const isAssigned = project.assignedTo && project.assignedTo.some(id => id.toString() === assignedEmployeeId.toString());

  if (!isManager && !isMember && !isAssigned) {
    project.teamMembers = project.teamMembers || [];
    project.teamMembers.push(assignedEmployeeId);
    project.assignedTo = project.assignedTo || [];
    project.assignedTo.push(assignedEmployeeId);
    await project.save();

    // Send Project Assignment Notification to Employee
    try {
      const empDoc = await Employee.findById(assignedEmployeeId);
      if (empDoc) {
        let user = await User.findOne({
          $or: [
            { _id: empDoc.userId },
            { employee: empDoc._id },
            { email: { $regex: `^${(empDoc.email || "").trim()}$`, $options: "i" } }
          ]
        });

        if (user) {
          const existingNotif = await Notification.findOne({
            userId: user._id,
            title: "New Project Assignment",
            message: `You have been added to project: ${project.projectName}`
          });

          if (!existingNotif) {
            await sendNotification(io, {
              userId: user._id,
              title: "New Project Assignment",
              message: `You have been added to project: ${project.projectName}`,
              type: "info"
            });
          }
        }
      }
    } catch (err) {
      console.error("Error auto-adding member to project:", err);
    }
  }

  // 2. Leave Availability Check (Requirement 9)
  const checkDate = targetDueDate ? new Date(targetDueDate) : (project.dueDate ? new Date(project.dueDate) : new Date());
  const conflictingLeave = await Leave.findOne({
    employee: assignedEmployeeId,
    status: "Approved",
    startDate: { $lte: checkDate },
    endDate: { $gte: checkDate }
  });

  if (conflictingLeave) {
    const employee = await Employee.findById(assignedEmployeeId);
    const empName = employee ? employee.name : "Employee";
    const startStr = new Date(conflictingLeave.startDate).toLocaleDateString();
    const endStr = new Date(conflictingLeave.endDate).toLocaleDateString();
    return {
      status: 400,
      message: `${empName} is on approved leave during this period (${startStr} to ${endStr}). Assignment rejected.`
    };
  }

  return null;
};

// Create/Assign Task
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedEmployeeId, hoursLogged, dueDate, status } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required" });
    }

    // Run backend validations
    if (assignedEmployeeId) {
      const validationError = await validateTaskAssignment(projectId, assignedEmployeeId, dueDate, req.app.get("io"), req.user?.id);
      if (validationError) {
        return res.status(validationError.status).json({ message: validationError.message });
      }
    }

    const task = new Task({
      title,
      description: description || "",
      projectId,
      assignedEmployeeId: assignedEmployeeId || null,
      hoursLogged: hoursLogged || 0,
      dueDate: dueDate || null,
      status: status || "Todo"
    });

    await task.save();

    if (assignedEmployeeId) {
      await notifyTaskAssignee(req.app.get("io"), title, projectId, assignedEmployeeId, req.user?.id);
    }

    const populatedTask = await Task.findById(task._id)
      .populate("projectId", "projectName status dueDate priority")
      .populate("assignedEmployeeId", "name email department designation");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Task (Full details by Admin/Project Manager)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldAssignee = task.assignedEmployeeId ? task.assignedEmployeeId.toString() : null;

    const { title, description, assignedEmployeeId, hoursLogged, dueDate, status, projectId } = req.body;
    const effectiveProjectId = projectId || task.projectId;
    const effectiveEmployeeId = assignedEmployeeId !== undefined ? assignedEmployeeId : task.assignedEmployeeId;
    const effectiveDueDate = dueDate !== undefined ? dueDate : task.dueDate;

    if (effectiveEmployeeId && (assignedEmployeeId !== undefined || dueDate !== undefined)) {
      const validationError = await validateTaskAssignment(effectiveProjectId, effectiveEmployeeId, effectiveDueDate, req.app.get("io"), req.user?.id);
      if (validationError) {
        return res.status(validationError.status).json({ message: validationError.message });
      }
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedEmployeeId !== undefined) task.assignedEmployeeId = assignedEmployeeId || null;
    if (hoursLogged !== undefined) task.hoursLogged = Number(hoursLogged);
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status) task.status = status;
    if (projectId) task.projectId = projectId;

    await task.save();

    if (effectiveEmployeeId && effectiveEmployeeId.toString() !== oldAssignee) {
      await notifyTaskAssignee(req.app.get("io"), task.title, effectiveProjectId, effectiveEmployeeId, req.user?.id);
    }

    const populatedTask = await Task.findById(task._id)
      .populate("projectId", "projectName status dueDate priority")
      .populate("assignedEmployeeId", "name email department designation");

    res.json({ message: "Task updated successfully", task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Task Status (by Employee or Admin)
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Todo", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.json({ message: "Status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Log Working Hours
const logHours = async (req, res) => {
  try {
    const { hours } = req.body;
    if (!hours || Number(hours) <= 0) {
      return res.status(400).json({ message: "Invalid hours count" });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ownership check for employees
    const userRole = (req.user?.role || "").toLowerCase();
    const isPrivileged = ["super admin", "admin", "project manager"].includes(userRole);
    if (!isPrivileged) {
      const empDocId = req.user.employeeDocId?.toString();
      if (!task.assignedEmployeeId || task.assignedEmployeeId.toString() !== empDocId) {
        return res.status(403).json({ message: "Access denied: You can only log hours on your own tasks." });
      }
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

// Get Tasks (with optional filtering and role scoping)
const getTasks = async (req, res) => {
  try {
    const { projectId, assignedEmployeeId } = req.query;
    const userRole = (req.user?.role || "").toLowerCase();
    const isPrivileged = ["super admin", "admin", "project manager"].includes(userRole);

    const filter = {};

    if (projectId) filter.projectId = projectId;

    if (!isPrivileged) {
      // Employee sees only their own tasks
      let empDocId = req.user.employeeDocId;
      if (!empDocId && req.user?.id) {
        const emp = await Employee.findOne({
          $or: [
            { userId: req.user.id },
            { email: { $regex: `^${(req.user.email || "").trim()}$`, $options: "i" } },
            { name: { $regex: `^${(req.user.name || "").trim()}$`, $options: "i" } }
          ]
        });
        if (emp) empDocId = emp._id;
      }

      if (!empDocId) return res.status(200).json([]);
      filter.assignedEmployeeId = empDocId;
    } else if (assignedEmployeeId) {
      filter.assignedEmployeeId = assignedEmployeeId;
    }

    const tasks = await Task.find(filter)
      .populate("projectId", "projectName status dueDate priority")
      .populate("assignedEmployeeId", "name email department designation")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Authenticated Employee's Tasks (/api/projects/tasks/me)
const getMyTasks = async (req, res) => {
  try {
    let empDocId = req.user.employeeDocId;
    if (!empDocId && req.user?.id) {
      const emp = await Employee.findOne({
        $or: [
          { userId: req.user.id },
          { email: { $regex: `^${(req.user.email || "").trim()}$`, $options: "i" } },
          { name: { $regex: `^${(req.user.name || "").trim()}$`, $options: "i" } }
        ]
      });
      if (emp) empDocId = emp._id;
    }

    if (!empDocId) {
      return res.status(200).json([]);
    }

    const tasks = await Task.find({ assignedEmployeeId: empDocId })
      .populate("projectId", "projectName status dueDate priority")
      .populate("assignedEmployeeId", "name email department designation")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Tasks by Employee ID
const getTasksByEmployee = async (req, res) => {
  try {
    const userRole = (req.user?.role || "").toLowerCase();
    const isPrivileged = ["super admin", "admin", "project manager"].includes(userRole);

    let empDocId = req.user.employeeDocId;
    if (!empDocId && req.user?.id) {
      const emp = await Employee.findOne({
        $or: [
          { userId: req.user.id },
          { email: { $regex: `^${(req.user.email || "").trim()}$`, $options: "i" } },
          { name: { $regex: `^${(req.user.name || "").trim()}$`, $options: "i" } }
        ]
      });
      if (emp) empDocId = emp._id;
    }

    // Prevent Employee A from requesting Employee B's tasks
    if (!isPrivileged && req.params.employeeId !== empDocId?.toString()) {
      return res.status(403).json({ message: "Access denied: You can only view your own tasks." });
    }

    const tasks = await Task.find({ assignedEmployeeId: req.params.employeeId })
      .populate("projectId", "projectName status dueDate priority")
      .populate("assignedEmployeeId", "name email department designation")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Task (Admin & PM only)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  updateTaskStatus,
  logHours,
  getTasks,
  getMyTasks,
  getTasksByEmployee,
  deleteTask
};
