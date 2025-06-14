const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Conflict: Data sudah ada', details: err.errors.map(e => e.message) });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Bad Request: Validasi gagal', details: err.errors.map(e => e.message) });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

module.exports = errorHandler;