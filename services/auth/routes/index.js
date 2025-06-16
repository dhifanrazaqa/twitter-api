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

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    session: false,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Autentikasi Google gagal." });
      }

      const { accessToken, refreshToken } =
        await authController.generateAndStoreTokens(req.user.id);

      res.status(200).json({
        message:
          "Autentikasi Google berhasil. Gunakan token ini untuk permintaan selanjutnya.",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }
);

module.exports = router;
