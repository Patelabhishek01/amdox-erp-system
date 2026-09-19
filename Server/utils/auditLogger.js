const AuditLog = require("../models/AuditLog");
const User = require("../modules/auth/models/user");

/**
 * Logs an audit event to the database.
 * 
 * @param {Object} req - The Express request object (to extract user and IP)
 * @param {String} action - The action performed (e.g., "Create Employee")
 * @param {String} moduleName - The module name (e.g., "HR", "Sales")
 * @param {String} details - Additional details about the action
 */
const logAudit = async (req, action, moduleName, details = "") => {
  try {
    if (!req.user || !req.user.id) return; // Ignore if unauthenticated

    let userName = "Unknown User";
    const user = await User.findById(req.user.id).select("name");
    if (user) {
      userName = user.name;
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown IP";

    await AuditLog.create({
      userId: req.user.id,
      userName,
      action,
      module: moduleName,
      details,
      ipAddress
    });
  } catch (error) {
    console.error("Failed to log audit event:", error);
  }
};

module.exports = { logAudit };
