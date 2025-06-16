const notFoundHandler = (req, res, next) => {
  const error = new Error(`Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFoundHandler;