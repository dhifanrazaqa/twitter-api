const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = '3h';
const REFRESH_TOKEN_EXPIRATION = '7d';

async function generateAndStoreTokens(userId) {
  try {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    await redisClient.set(userId.toString(), refreshToken, 'EX', 7 * 24 * 60 * 60);

    logger.info(`Token dibuat untuk user ID: ${userId}`);
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error('Gagal membuat token:', error);
    throw new Error('Proses pembuatan token gagal.');
  }
}

exports.generateTokens = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID dibutuhkan' });
    }
    const tokens = await generateAndStoreTokens(userId);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token dibutuhkan' });
    }

    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const storedToken = await redisClient.get(decoded.userId.toString());

    if (token !== storedToken) {
      return res.status(403).json({ message: 'Refresh token tidak valid atau sudah dicabut' });
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    logger.info(`Access token diperbarui untuk user ID: ${decoded.userId}`);
    res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
      error.statusCode = 403;
    }
    next(error);
  }
};

exports.logout = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID dibutuhkan' });
        }
        await redisClient.del(userId.toString());
        logger.info(`User ID: ${userId} berhasil logout.`);
        res.status(200).json({ message: 'Logout berhasil' });
    } catch (error) {
        next(error);
    }
};

module.exports.generateAndStoreTokens = generateAndStoreTokens;