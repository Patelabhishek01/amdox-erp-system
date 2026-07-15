const User = require("../models/user");
const Session = require("../models/session");
const AuditLog = require("../../../models/AuditLog");
const Setting = require("../../../models/Setting");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const JWT_SECRET = process.env.JWT_SECRET || "SecretKey897123";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "RefreshSecretKey789";

// Generate Token pair
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "15m" } // 15 minutes access token
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // 7 days refresh token
  );
  
  return { accessToken, refreshToken };
};

// Helper: Log security action
const logSecurityAction = async (userId, userName, action, details, req) => {
  try {
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    await AuditLog.create({
      userId,
      userName,
      action,
      module: "Authentication",
      details,
      ipAddress
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }
};

// ✅ REGISTER (Public enabled)
const register = async (req, res) => {
  try {
    let { name, email, password, role, departmentId, firstName, lastName } = req.body;
    
    // Combine first/last names if sent by React client instead of full name
    if (!name && (firstName || lastName)) {
      name = `${firstName || ""} ${lastName || ""}`.trim();
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: (role || "employee").toLowerCase(),
      departmentId: departmentId || null,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      passwordHistory: [hashedPassword],
      active: false // Inactive until approved by Admin
    });

    await newUser.save();

    // Log the user registration request
    await logSecurityAction(newUser._id, newUser.email, "Registration Requested", `Submitted registration request for: ${newUser.email}`, req);

    // Create and save Admin Notification for new registration
    const Notification = require("../../../models/Notification");
    const adminNotification = new Notification({
      title: "New User Registration",
      message: `User ${newUser.name} (${newUser.email}) has registered and is pending approval.`,
      role: "admin"
    });
    await adminNotification.save();

    const io = req.app.get("socketio");
    if (io) {
      io.emit("notification", adminNotification);
    }

    res.status(201).json({
      message: "Registration request submitted successfully ✅. Please wait for an administrator to approve your account.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// ✅ LOGIN
const login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.active) {
      return res.status(403).json({ message: "Account disabled. Please contact administrator" });
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        message: `Account is temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minute(s).`
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
        await user.save();
        await logSecurityAction(user._id, user.name, "Account Locked", "Too many failed login attempts", req);
        return res.status(403).json({
          message: "Account locked due to 5 failed login attempts. Please try again after 15 minutes."
        });
      }
      
      await user.save();
      return res.status(400).json({
        message: `Invalid email or password. Attempt ${user.failedLoginAttempts} of 5.`
      });
    }

    // Reset lockout counters on success
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    // Check if password change is forced on first login
    if (user.isFirstLogin) {
      const { accessToken } = generateTokens(user);
      return res.status(200).json({
        forcePasswordChange: true,
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // 2FA Verification Check
    if (user.twoFactorEnabled) {
      if (!otp) {
        // Signal that OTP is required to complete login
        return res.status(200).json({ twoFactorRequired: true, userId: user._id });
      }
      
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: otp,
        window: 1 // Allow 30 seconds clock drift
      });

      if (!verified) {
        await logSecurityAction(user._id, user.name, "Failed 2FA Login Attempt", "Invalid OTP code", req);
        return res.status(400).json({ message: "Invalid 2FA verification code" });
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save session in database
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const device = userAgent.includes("Mobile") ? "Mobile Device" : "Desktop Computer";

    const session = new Session({
      userId: user._id,
      token: refreshToken,
      ipAddress,
      userAgent,
      device
    });
    await session.save();

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Log the successful login
    await logSecurityAction(user._id, user.name, "User Logged In", `Logged in on ${device}`, req);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        profilePhoto: user.profilePhoto,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ✅ REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(403).json({ message: "Invalid refresh token session" });
    }

    jwt.verify(token, JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        await Session.deleteOne({ token });
        return res.status(403).json({ message: "Expired refresh token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
    });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: "Server error during token refresh" });
  }
};

// ✅ LOGOUT
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await Session.deleteOne({ token: refreshToken });
    }
    
    if (req.user) {
      await logSecurityAction(req.user.id, req.user.email, "User Logged Out", "Session terminated", req);
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// ✅ 2FA SETUP
const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate secret key
    const secret = speakeasy.generateSecret({
      name: `Amdox ERP (${user.email})`
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code URL
    QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ message: "Failed to generate QR code" });
      }
      res.status(200).json({
        secret: secret.base32,
        qrCode: dataUrl
      });
    });

  } catch (error) {
    console.error("2FA Setup Error:", error);
    res.status(500).json({ message: "Server error setting up 2FA" });
  }
};

// ✅ 2FA VERIFY & TOGGLE
const verify2FA = async (req, res) => {
  try {
    const { token, enable } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.twoFactorEnabled = !!enable;
    if (!enable) {
      user.twoFactorSecret = ""; // Clear secret on disable
    }
    await user.save();

    await logSecurityAction(
      user._id,
      user.name,
      enable ? "2FA Enabled" : "2FA Disabled",
      `Two-factor authentication modified`,
      req
    );

    res.status(200).json({
      success: true,
      message: enable ? "2FA successfully enabled ✅" : "2FA successfully disabled ❌"
    });

  } catch (error) {
    console.error("2FA Verify Error:", error);
    res.status(500).json({ message: "Server error verifying 2FA" });
  }
};

// ✅ SOCIAL AUTH MOCK
const socialLoginMock = async (req, res) => {
  try {
    const { provider, email, name, avatar } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      // Create user if they don't exist
      const mockPassword = await bcrypt.hash("SocialMockPassword123!", 10);
      user = new User({
        name: name || "OAuth User",
        email,
        password: mockPassword,
        role: "employee",
        profilePhoto: avatar || "",
        active: true
      });
      await user.save();
      await logSecurityAction(user._id, user.name, "Social Register", `Created via ${provider} authentication`, req);
    } else {
      if (avatar && !user.profilePhoto) {
        user.profilePhoto = avatar;
        await user.save();
      }
    }

    const { accessToken, refreshToken } = generateTokens(user);
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const device = userAgent.includes("Mobile") ? "Mobile Device" : "Desktop Computer";

    const session = new Session({
      userId: user._id,
      token: refreshToken,
      ipAddress,
      userAgent,
      device
    });
    await session.save();

    user.lastLogin = new Date();
    await user.save();

    await logSecurityAction(user._id, user.name, "Social Login", `OAuth sign-in with ${provider}`, req);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        profilePhoto: user.profilePhoto,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

  } catch (error) {
    console.error("Social Auth Error:", error);
    res.status(500).json({ message: "Server error during social auth" });
  }
};

// ✅ LIST ACTIVE SESSIONS
const getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).select("-token");
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Get Sessions Error:", error);
    res.status(500).json({ message: "Server error loading sessions" });
  }
};

// ✅ REVOKE SESSION
const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    await Session.deleteOne({ _id: sessionId, userId: req.user.id });
    res.status(200).json({ message: "Session revoked successfully" });
  } catch (error) {
    console.error("Revoke Session Error:", error);
    res.status(500).json({ message: "Server error revoking session" });
  }
};

// ✅ CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Password strength check
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, contain an uppercase letter, and a number."
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify against password history (last 3 passwords)
    const history = user.passwordHistory || [];
    const isRecent = await Promise.all(
      history.slice(-3).map(async (hashedPass) => {
        try {
          return await bcrypt.compare(newPassword, hashedPass);
        } catch {
          return false;
        }
      })
    );

    if (isRecent.includes(true)) {
      return res.status(400).json({
        message: "You cannot reuse any of your last 3 passwords."
      });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isFirstLogin = false;
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    
    // Manage history array (limit to last 5 entries)
    if (!user.passwordHistory) user.passwordHistory = [];
    user.passwordHistory.push(hashedPassword);
    if (user.passwordHistory.length > 5) {
      user.passwordHistory.shift();
    }

    await user.save();

    await logSecurityAction(user._id, user.name, "Password Changed", "Successfully reset credentials", req);

    res.status(200).json({ message: "Password updated successfully ✅" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  setup2FA,
  verify2FA,
  socialLoginMock,
  getActiveSessions,
  revokeSession,
  changePassword
};