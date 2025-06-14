const express = require("express");
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

module.exports = router;
