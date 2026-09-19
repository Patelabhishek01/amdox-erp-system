const jwt = require("jsonwebtoken");
const Employee = require("../modules/hr/models/employee");
const JWT_SECRET = process.env.JWT_SECRET || "SecretKey897123";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Ensure employee identification is attached
    if (!req.user.employeeDocId && decoded.id) {
      try {
        const User = require("../modules/auth/models/user");
        let emp = await Employee.findOne({ userId: decoded.id }).select("_id employeeId name email department designation");
        
        if (!emp && decoded.email) {
          emp = await Employee.findOne({ email: { $regex: `^${decoded.email.trim()}$`, $options: "i" } }).select("_id employeeId name email department designation");
        }
        
        if (!emp && decoded.name) {
          emp = await Employee.findOne({ name: { $regex: `^${decoded.name.trim()}$`, $options: "i" } }).select("_id employeeId name email department designation");
        }

        if (emp) {
          req.user.employeeDocId = emp._id.toString();
          req.user.employeeId = emp.employeeId;
          req.employee = emp;

          // Auto-link bi-directionally in MongoDB if unlinked
          if (!emp.userId) {
            emp.userId = decoded.id;
            await emp.save().catch(() => {});
          }
          await User.findByIdAndUpdate(decoded.id, { employee: emp._id }).catch(() => {});
        }
      } catch (err) {
        console.error("Error attaching employee in authMiddleware:", err);
      }
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", expired: true });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  const userRole = (req.user?.role || "").toLowerCase();
  if (userRole !== "admin" && userRole !== "super admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};

const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userRole = req.user.role;
    const lowerUserRole = (userRole || "").toLowerCase();
    
    // Super Admin can access everything
    if (lowerUserRole === "super admin") {
      return next();
    }
    
    if (allowedRoles.length > 0) {
      const lowerAllowed = allowedRoles.map(r => r.toLowerCase());
      
      const isAllowed = lowerAllowed.some(allowed => {
        return lowerUserRole === allowed || 
               lowerUserRole.startsWith(allowed + " ") || 
               lowerUserRole.includes(" " + allowed) ||
               (allowed === "hr" && lowerUserRole.startsWith("hr"));
      });

      if (!isAllowed) {
        return res.status(403).json({ message: "Access denied: Insufficient permissions" });
      }
    }
    next();
  };
};

module.exports = { authMiddleware, adminMiddleware, checkRole };