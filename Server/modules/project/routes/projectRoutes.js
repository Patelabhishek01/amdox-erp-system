const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

// Create Project
router.post("/", createProject);

// Get All Projects (with optional ?search=)
router.get("/", getProjects);

// Get Single Project
router.get("/:id", getProjectById);

// Update Project
router.put("/:id", updateProject);

// Delete Project
router.delete("/:id", deleteProject);

module.exports = router;