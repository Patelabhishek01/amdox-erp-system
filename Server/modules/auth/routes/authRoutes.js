const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../../middleware/authMiddleware");

const {
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
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authMiddleware, logout);
router.post("/change-password", authMiddleware, changePassword);
router.post("/2fa/setup", authMiddleware, setup2FA);
router.post("/2fa/verify", authMiddleware, verify2FA);
router.post("/social-login", socialLoginMock);
router.get("/sessions", authMiddleware, getActiveSessions);
router.post("/sessions/revoke", authMiddleware, revokeSession);

module.exports = router;