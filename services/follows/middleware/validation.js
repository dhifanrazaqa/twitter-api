const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const followValidation = [
  body('userId').notEmpty().withMessage('User ID tidak boleh kosong').isUUID().withMessage('User ID harus UUID'),
  handleValidationErrors,
];

const paramValidation = [
  param('userId').notEmpty().withMessage('User ID tidak boleh kosong').isUUID().withMessage('User ID harus UUID'),
  handleValidationErrors,
];

module.exports = {
  followValidation,
  paramValidation,
};