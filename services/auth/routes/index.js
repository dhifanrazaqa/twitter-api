const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  generateTokenValidation,
  refreshTokenValidation,
  logoutValidation,
} = require("../middleware/validation");

router.post("/token", generateTokenValidation, authController.generateTokens);
router.post("/refresh", refreshTokenValidation, authController.refreshToken);
router.post("/logout", logoutValidation, authController.logout);
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token valid", user: req.user });
});

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Google OAuth gagal, user tidak ditemukan" });
      }
      const jwt = require('jsonwebtoken');
      const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
      const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
      const ACCESS_TOKEN_EXPIRATION = '15m';
      const REFRESH_TOKEN_EXPIRATION = '7d';
      const redisClient = require('../config/redis');

      const userId = req.user.id;
      const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
      const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
      await redisClient.set(userId.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60);

      res.json({
        accessToken,
        refreshToken,
        user: req.user,
        message: "Google OAuth success"
      });
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
  }
);

module.exports = router;
