const Notification = require("../models/Notification");

/**
 * Sends a notification and emits it via Socket.IO
 * 
 * @param {Object} io - Socket.io instance from req.app.get("io")
 * @param {Object} params - Notification parameters
 * @param {String} params.userId - Target user ID (optional, overrides department/role if specific)
 * @param {String} params.department - Target department (optional)
 * @param {String} params.role - Target role (optional)
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification message
 * @param {String} params.type - Type (success, warning, error, info)
 */
const sendNotification = async (io, params) => {
  try {
    const { userId, department, role, title, message, type = "info" } = params;

    const notification = new Notification({
      userId: userId || undefined,
      department: department || undefined,
      role: role ? role.toLowerCase() : undefined,
      title,
      message,
      type,
    });

    await notification.save();

    if (io) {
      if (userId) {
        io.to(userId.toString()).emit("notification", notification);
      } else if (department) {
        io.to(department).emit("notification", notification);
      } else {
        io.emit("notification", notification);
      }
    }
    
    return notification;
  } catch (error) {
    console.error("Error sending internal notification:", error);
  }
};

module.exports = { sendNotification };
