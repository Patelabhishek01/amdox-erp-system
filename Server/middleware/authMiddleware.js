const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "SecretKey897123";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", expired: true });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || (req.user.role || "").toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};

// Reusable role-based permission checker
const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userRole = (req.user.role || "").toLowerCase();
    const lowercaseAllowed = allowedRoles.map(r => r.toLowerCase());
    
    if (allowedRoles.length > 0 && !lowercaseAllowed.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, adminMiddleware, checkRole };