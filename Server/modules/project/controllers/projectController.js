const Project = require("../models/Project");
const Employee = require("../../hr/models/employee");
const User = require("../../auth/models/user");
const Notification = require("../../../models/Notification");
const { sendNotification } = require("../../../utils/notify");

// Helper: Synchronize assignedTo array for backward compatibility
const syncAssignedTo = (data) => {
  const members = Array.isArray(data.teamMembers) ? [...data.teamMembers] : [];
  if (data.projectManager && !members.some(id => id.toString() === data.projectManager.toString())) {
    members.push(data.projectManager);
  }
  return members;
};

// Helper: Resolve User for an Employee and create project assignment notification
const notifyTeamMembers = async (io, project, targetEmpIds, triggeringUserId) => {
  if (!targetEmpIds || targetEmpIds.length === 0) return;

  for (const empId of targetEmpIds) {
    try {
      if (!empId) continue;
      const empDoc = await Employee.findById(empId);
      if (!empDoc) continue;

      let user = await User.findOne({
        $or: [
          { _id: empDoc.userId },
          { employee: empDoc._id },
          { email: { $regex: `^${empDoc.email?.trim()}$`, $options: "i" } }
        ]
      });

      if (!user) continue;

      // Do not send notification to triggering user
      if (triggeringUserId && user._id.toString() === triggeringUserId.toString()) {
        continue;
      }

      // Check if duplicate notification already exists
      const existingNotif = await Notification.findOne({
        userId: user._id,
        title: "New Project Assignment",
        message: `You have been added to project: ${project.projectName}`
      });

      if (existingNotif) continue;

      await sendNotification(io, {
        userId: user._id,
        title: "New Project Assignment",
        message: `You have been added to project: ${project.projectName}`,
        type: "info"
      });
    } catch (err) {
      console.error("Error sending project notification:", err);
    }
  }
};

// Create Project
exports.createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };

    // Sync legacy assignedTo array with teamMembers/projectManager
    if (projectData.teamMembers || projectData.projectManager) {
      projectData.assignedTo = syncAssignedTo(projectData);
    }

    const project = await Project.create(projectData);

    const populatedProject = await Project.findById(project._id)
      .populate("projectManager", "name email department designation userId")
      .populate("teamMembers", "name email department designation userId")
      .populate("assignedTo", "name email department designation userId");

    // Notify Project Manager and Team Members
    const targets = (populatedProject.assignedTo || []).map(m => m._id);
    await notifyTeamMembers(req.app.get("io"), populatedProject, targets, req.user?.id);

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// Get All Projects (with role-based scoping and search)
exports.getProjects = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const userRole = (req.user?.role || "").toLowerCase();
    const isPrivileged = ["super admin", "admin", "project manager"].includes(userRole);

    const filter = {};

    if (search) {
      filter.$or = [
        { projectName: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    // If regular employee, only show projects where they are PM or team member
    if (!isPrivileged) {
      const empDocId = req.user.employeeDocId;
      if (!empDocId) {
        return res.status(200).json([]);
      }
      const employeeFilter = [
        { projectManager: empDocId },
        { teamMembers: empDocId },
        { assignedTo: empDocId }
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: employeeFilter }];
        delete filter.$or;
      } else {
        filter.$or = employeeFilter;
      }
    }

    const projects = await Project.find(filter)
      .populate("projectManager", "name email department designation")
      .populate("teamMembers", "name email department designation")
      .populate("assignedTo", "name email department designation")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// Get Authenticated Employee's Projects (/api/projects/me)
exports.getMyProjects = async (req, res) => {
  try {
    const empDocId = req.user.employeeDocId;
    if (!empDocId) {
      return res.status(200).json([]);
    }

    const projects = await Project.find({
      $or: [
        { projectManager: empDocId },
        { teamMembers: empDocId },
        { assignedTo: empDocId }
      ]
    })
      .populate("projectManager", "name email department designation")
      .populate("teamMembers", "name email department designation")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your projects",
      error: error.message,
    });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("projectManager", "name email department designation")
      .populate("teamMembers", "name email department designation")
      .populate("assignedTo", "name email department designation");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Role check: If employee, verify they belong to the project
    const userRole = (req.user?.role || "").toLowerCase();
    const isPrivileged = ["super admin", "admin", "project manager"].includes(userRole);
    if (!isPrivileged) {
      const empDocId = req.user.employeeDocId?.toString();
      const isManager = project.projectManager?._id?.toString() === empDocId;
      const isMember = project.teamMembers?.some(m => m._id?.toString() === empDocId);
      const isAssigned = project.assignedTo?.some(m => m._id?.toString() === empDocId);

      if (!isManager && !isMember && !isAssigned) {
        return res.status(403).json({
          message: "Access denied: You are not assigned to this project."
        });
      }
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const oldMembers = (existingProject.teamMembers || []).map(id => id.toString());
    const oldManager = existingProject.projectManager ? existingProject.projectManager.toString() : null;

    const projectData = { ...req.body };

    if (projectData.teamMembers || projectData.projectManager) {
      projectData.assignedTo = syncAssignedTo(projectData);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      projectData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("projectManager", "name email department designation")
      .populate("teamMembers", "name email department designation")
      .populate("assignedTo", "name email department designation");

    // Find newly added team members or manager
    const currentMembers = (project.teamMembers || []).map(m => m._id.toString());
    const newlyAdded = currentMembers.filter(id => !oldMembers.includes(id));
    if (project.projectManager && project.projectManager._id.toString() !== oldManager && !newlyAdded.includes(project.projectManager._id.toString())) {
      newlyAdded.push(project.projectManager._id.toString());
    }

    if (newlyAdded.length > 0) {
      await notifyTeamMembers(req.app.get("io"), project, newlyAdded, req.user?.id);
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
};