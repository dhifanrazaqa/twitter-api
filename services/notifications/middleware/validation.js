const { body, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createTweetValidation = [
  body('content')
    .notEmpty().withMessage('Isi tweet tidak boleh kosong')
    .isLength({ max: 280 }).withMessage('Tweet tidak boleh lebih dari 280 karakter'),
  body('replyToTweetId').optional().isUUID().withMessage('ID tweet yang dibalas tidak valid'),
  handleValidationErrors,
];

const updateTweetValidation = [
  body('content')
    .notEmpty().withMessage('Isi tweet tidak boleh kosong')
    .isLength({ max: 280 }).withMessage('Tweet tidak boleh lebih dari 280 karakter'),
  handleValidationErrors,
];

const timelineValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page harus berupa angka positif').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit antara 1-100').toInt(),
  handleValidationErrors,
];

module.exports = {
  createTweetValidation,
  updateTweetValidation,
  timelineValidation,
};