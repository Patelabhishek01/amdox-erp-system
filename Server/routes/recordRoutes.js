const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { authMiddleware } = require("../middleware/authMiddleware");
const Comment = require("../models/Comment");
const Attachment = require("../models/Attachment");
const AuditLog = require("../models/AuditLog");

// ─── Multer Configuration for Attachments ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/attachments");
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
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB file size limit
});

// ✅ COMMENTS ROUTING
// GET comments for record
router.get("/records/:module/:recordId/comments", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({
      module: req.params.module,
      recordId: req.params.recordId
    }).sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

// POST comment to record
router.post("/records/:module/:recordId/comments", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Comment content required" });

    const newComment = new Comment({
      recordId: req.params.recordId,
      module: req.params.module,
      userId: req.user.id,
      userName: req.user.email.split("@")[0], // Fallback if name is empty
      content
    });

    // Try to fetch real user name
    const User = require("../modules/auth/models/user");
    const user = await User.findById(req.user.id);
    if (user) {
      newComment.userName = user.name;
    }

    await newComment.save();

    // Log this action
    await AuditLog.create({
      userId: req.user.id,
      userName: newComment.userName,
      action: "Add Comment",
      module: req.params.module,
      details: `Added comment to record: ${req.params.recordId}`
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Post comment error:", error);
    res.status(500).json({ message: "Error posting comment" });
  }
});

// ✅ ATTACHMENTS ROUTING
// GET attachments for record
router.get("/records/:module/:recordId/attachments", authMiddleware, async (req, res) => {
  try {
    const attachments = await Attachment.find({
      module: req.params.module,
      recordId: req.params.recordId
    }).sort({ createdAt: -1 });
    res.status(200).json(attachments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attachments" });
  }
});

// POST attachment file
router.post("/records/:module/:recordId/attachments", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const newAttachment = new Attachment({
      recordId: req.params.recordId,
      module: req.params.module,
      fileName: req.file.originalname,
      filePath: `/uploads/attachments/${req.file.filename}`,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadedBy: req.user.id
    });

    await newAttachment.save();

    // Get username for log
    let userName = req.user.email;
    const User = require("../modules/auth/models/user");
    const user = await User.findById(req.user.id);
    if (user) userName = user.name;

    await AuditLog.create({
      userId: req.user.id,
      userName,
      action: "Upload File",
      module: req.params.module,
      details: `Uploaded file ${req.file.originalname} to record ${req.params.recordId}`
    });

    res.status(201).json(newAttachment);
  } catch (error) {
    console.error("Upload attachment error:", error);
    res.status(500).json({ message: "Error uploading attachment" });
  }
});

// DELETE attachment file
router.delete("/records/attachments/:id", authMiddleware, async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) return res.status(404).json({ message: "Attachment not found" });

    // Try to remove local file if it exists
    const localPath = path.join(__dirname, `..${attachment.filePath}`);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    await Attachment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Attachment deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attachment" });
  }
});

// ✅ RECORD AUDIT TIMELINE LOGS
router.get("/records/:module/:recordId/logs", authMiddleware, async (req, res) => {
  try {
    const logs = await AuditLog.find({
      module: req.params.module,
      details: { $regex: req.params.recordId, $options: "i" }
    }).sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching audit timeline" });
  }
});

module.exports = router;
