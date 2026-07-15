const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");
const User = require("../modules/auth/models/user");

// ✅ GET all notifications for active user
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch individual notifications, department-targeted, role-targeted, or general broadcasts
    const notifications = await Notification.find({
      $or: [
        { userId: req.user.id },
        { department: user.department },
        { role: user.role ? user.role.toLowerCase() : "" },
        { userId: { $exists: false }, department: { $exists: false }, role: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ SEND/CREATE notification (Admin only or system level)
router.post("/notifications", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId, department, title, message, type } = req.body;
    
    const notification = new Notification({
      userId: userId || undefined,
      department: department || undefined,
      title,
      message,
      type: type || "info"
    });

    await notification.save();

    // Trigger Socket.IO real-time notification
    const io = req.app.get("io");
    if (io) {
      if (userId) {
        // Individual room
        io.to(userId.toString()).emit("notification", notification);
      } else if (department) {
        // Department room
        io.to(department).emit("notification", notification);
      } else {
        // Broadcast to all
        io.emit("notification", notification);
      }
    }

    res.status(201).json({ message: "Notification sent successfully ✅", notification });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ MARK notification as read
router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findById(req.id || req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // If it's a broadcast, track read users list
    if (!notification.userId && !notification.department) {
      if (!notification.readBy.includes(req.user.id)) {
        notification.readBy.push(req.user.id);
      }
    } else {
      notification.isRead = true;
    }

    await notification.save();
    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ MARK ALL notifications as read
router.put("/notifications/read-all", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Target individual and department notifications
    await Notification.updateMany(
      { 
        $or: [
          { userId: req.user.id },
          { department: user.department }
        ],
        isRead: false
      },
      { $set: { isRead: true } }
    );

    // Track broadcasts
    const broadcasts = await Notification.find({
      userId: { $exists: false },
      department: { $exists: false },
      readBy: { $ne: req.user.id }
    });

    for (let bc of broadcasts) {
      bc.readBy.push(req.user.id);
      await bc.save();
    }

    res.status(200).json({ message: "All notifications marked as read ✅" });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE notification
router.delete("/notifications/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted successfully ❌" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
