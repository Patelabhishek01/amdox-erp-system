const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const Setting = require("../models/Setting");
const User = require("../modules/auth/models/user");
const AuditLog = require("../models/AuditLog");

// Helper: Log security action
const logActivity = async (userId, userName, action, details) => {
  try {
    await AuditLog.create({
      userId,
      userName,
      action,
      module: "System Configuration",
      details
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

// ✅ GET settings
router.get("/settings", authMiddleware, async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Fetch settings error:", error);
    res.status(500).json({ message: "Server error loading settings" });
  }
});

// ✅ UPDATE settings
router.put("/settings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      email,
      language,
      timezone,
      notifications,
      darkMode,
      twoFactorAuth,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      llmProvider,
      llmApiKey,
      rolePermissions
    } = req.body;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (companyName !== undefined) settings.companyName = companyName;
    if (email !== undefined) settings.email = email;
    if (language !== undefined) settings.language = language;
    if (timezone !== undefined) settings.timezone = timezone;
    if (notifications !== undefined) settings.notifications = notifications;
    if (darkMode !== undefined) settings.darkMode = darkMode;
    if (twoFactorAuth !== undefined) settings.twoFactorAuth = twoFactorAuth;
    if (smtpHost !== undefined) settings.smtpHost = smtpHost;
    if (smtpPort !== undefined) settings.smtpPort = smtpPort;
    if (smtpUser !== undefined) settings.smtpUser = smtpUser;
    if (smtpPass !== undefined) settings.smtpPass = smtpPass;
    if (llmProvider !== undefined) settings.llmProvider = llmProvider;
    if (llmApiKey !== undefined) settings.llmApiKey = llmApiKey;
    if (rolePermissions !== undefined) settings.rolePermissions = rolePermissions;

    await settings.save();

    await logActivity(req.user.id, req.user.email, "Update Settings", "Modified system-wide properties");

    res.status(200).json({ message: "Settings updated successfully ✅", settings });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ message: "Server error saving settings" });
  }
});

// ✅ DATABASE BACKUP (Admin only)
router.get("/settings/backup", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const backupData = {};

    for (let col of collections) {
      const name = col.name;
      // Skip sessions and indexes if needed, but get core collections
      if (name === "sessions") continue;
      const documents = await db.collection(name).find({}).toArray();
      backupData[name] = documents;
    }

    res.setHeader("Content-disposition", `attachment; filename=amdox-erp-backup-${Date.now()}.json`);
    res.setHeader("Content-type", "application/json");
    res.status(200).send(JSON.stringify(backupData, null, 2));

    await logActivity(req.user.id, req.user.email, "Database Backup", "Downloaded complete system backup JSON");
  } catch (error) {
    console.error("Backup error:", error);
    res.status(500).json({ message: "Server backup failed" });
  }
});

// ✅ DATABASE RESTORE (Admin only)
router.post("/settings/restore", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const backupData = req.body;
    if (!backupData || typeof backupData !== "object") {
      return res.status(400).json({ message: "Invalid backup JSON data" });
    }

    const db = mongoose.connection.db;

    for (let colName in backupData) {
      const documents = backupData[colName];
      if (!Array.isArray(documents)) continue;

      // Clear existing records in collection
      await db.collection(colName).deleteMany({});

      if (documents.length > 0) {
        // Map back ObjectId structures
        const sanitizedDocs = documents.map(doc => {
          const newDoc = { ...doc };
          if (newDoc._id) newDoc._id = new mongoose.Types.ObjectId(newDoc._id);
          if (newDoc.userId) newDoc.userId = new mongoose.Types.ObjectId(newDoc.userId);
          if (newDoc.employee) newDoc.employee = new mongoose.Types.ObjectId(newDoc.employee);
          if (newDoc.createdAt) newDoc.createdAt = new Date(newDoc.createdAt);
          if (newDoc.updatedAt) newDoc.updatedAt = new Date(newDoc.updatedAt);
          return newDoc;
        });

        await db.collection(colName).insertMany(sanitizedDocs);
      }
    }

    await logActivity(req.user.id, req.user.email, "Database Restore", "Restored database from uploaded backup JSON");

    res.status(200).json({ message: "Database restored successfully ✅" });
  } catch (error) {
    console.error("Restore error:", error);
    res.status(500).json({ message: "Server restore failed" });
  }
});

// ✅ GET SECURITY / AUDIT LOGS (Admin only)
router.get("/settings/logs", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error loading logs" });
  }
});

module.exports = router;
