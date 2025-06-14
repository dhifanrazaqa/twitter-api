const axios = require("axios");
const logger = require("../config/logger");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  try {
    const authServiceUrl = "http://localhost:5002/verify";

    const response = await axios.get(authServiceUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    req.user = response.data.user;

    logger.info(
      `Token berhasil diverifikasi untuk user ID: ${req.user.userId}`
    );
    next();
  } catch (error) {
    logger.error("Error verifikasi token:", error.message);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res
      .status(503)
      .json({ message: "Layanan autentikasi tidak tersedia." });
  }
};

module.exports = authenticate;
