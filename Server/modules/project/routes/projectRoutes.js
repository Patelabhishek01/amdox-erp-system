const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  createTask,
  updateTask,
  updateTaskStatus,
  logHours,
  getTasks,
  getMyTasks,
  getTasksByEmployee,
  deleteTask,
} = require("../controllers/taskController");

const { authMiddleware, checkRole } = require("../../../middleware/authMiddleware");
const protect = authMiddleware;
const projectRoles = checkRole(["admin", "project", "project manager"]);

// ─── Task Routes ──────────────────────────────────────────────────────────────
router.post("/tasks", protect, projectRoles, createTask);
router.get("/tasks", protect, getTasks);
router.get("/tasks/me", protect, getMyTasks);
router.get("/tasks/employee/:employeeId", protect, getTasksByEmployee);
router.put("/tasks/:id", protect, projectRoles, updateTask);
router.patch("/tasks/:id/status", protect, updateTaskStatus);
router.patch("/tasks/:id/log-hours", protect, logHours);
router.delete("/tasks/:id", protect, projectRoles, deleteTask);

// ─── Project Routes ───────────────────────────────────────────────────────────
router.post("/", protect, projectRoles, createProject);
router.get("/", protect, getProjects);
router.get("/me", protect, getMyProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, projectRoles, updateProject);
router.delete("/:id", protect, projectRoles, deleteProject);

module.exports = router;