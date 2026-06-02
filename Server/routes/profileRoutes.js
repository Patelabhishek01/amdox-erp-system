const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const User = require("../modules/auth/models/user");

// GET profile
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data access granted ✅",
    user: req.user,
  });
});

// GET admin check
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin access granted 👑" });
});

// GET all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE user — single route handles name, email, role
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.json({ message: "User updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;