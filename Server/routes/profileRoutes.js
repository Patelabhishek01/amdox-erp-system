const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const User = require("../modules/auth/models/user");
const Employee = require("../modules/hr/models/employee");
const bcrypt = require("bcryptjs");
const AuditLog = require("../models/AuditLog");

// ─── Multer Upload Setup ───────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "");
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf", ".csv", ".xlsx", ".docx", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Supported: JPG, PNG, PDF, CSV, Excel, Word, ZIP"));
    }
  }
});

// GET profile details (fully populated)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const userObj = user.toObject();
    // Try to find matching Employee record in HR
    const employeeDoc = await Employee.findOne({ userId: req.user.id });
    if (employeeDoc) {
      userObj.employeeRecordId = employeeDoc._id;
    }
    
    res.json(userObj);
  } catch (error) {
    console.error("Fetch profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE profile (current user)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      phone,
      bio,
      skills,
      emergencyContact,
      socialLinks
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (emergencyContact) user.emergencyContact = emergencyContact;
    if (socialLinks) user.socialLinks = socialLinks;

    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select("-password");
    res.json({ message: "Profile updated successfully ✅", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// FILE UPLOAD (Single attachment: avatar or document)
router.post("/profile/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.body.type; // 'avatar' or 'resume' or 'document'

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fileType === "avatar") {
      user.profilePhoto = fileUrl;
    } else if (fileType === "resume") {
      user.resume = fileUrl;
    }
    
    await user.save();

    res.json({
      message: "File uploaded successfully ✅",
      fileUrl,
      fileName: req.file.filename,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message || "Server upload error" });
  }
});

// GET admin check
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin access granted 👑" });
});

// GET all users (Admin only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user (Admin only)
router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE user role/status (Admin only)
router.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, role, department, designation, active } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;
    if (active !== undefined) updateData.active = active;

    await User.findByIdAndUpdate(req.params.id, updateData);
    res.json({ message: "User updated successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE user with temporary password and forcePasswordChange (Admin only)
router.post("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, role, department, designation } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email, and role are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Generate random temporary password (e.g. "k3n9m1pA1!")
    const tempPassword = Math.random().toString(36).slice(-8) + "A1!";
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
      department: department || "Operations",
      designation: designation || "Staff Member",
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      isFirstLogin: true,
      failedLoginAttempts: 0,
      lockUntil: null,
      passwordHistory: [hashedPassword]
    });

    await newUser.save();

    // Log the user creation
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await AuditLog.create({
      userId: req.user.id,
      userName: req.user.email,
      action: "Create User",
      module: "Authentication",
      details: `Created new user: ${email} (${name}) with role: ${role}`,
      ipAddress
    });

    res.status(201).json({
      message: "User created successfully ✅",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        designation: newUser.designation,
        employeeId: newUser.employeeId,
      },
      tempPassword
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error creating user" });
  }
});

module.exports = router;