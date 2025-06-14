const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const generateTokenValidation = [
  body('userId').notEmpty().withMessage('User ID tidak boleh kosong').isUUID().withMessage('User ID harus berupa UUID yang valid'),
  handleValidationErrors,
];

const refreshTokenValidation = [
  body('token').notEmpty().withMessage('Refresh token tidak boleh kosong').isJWT().withMessage('Token harus berupa format JWT yang valid'),
  handleValidationErrors,
];

const logoutValidation = [
  body('userId').notEmpty().withMessage('User ID tidak boleh kosong').isUUID().withMessage('User ID harus berupa UUID yang valid'),
  handleValidationErrors,
];


module.exports = {
  generateTokenValidation,
  refreshTokenValidation,
  logoutValidation,
};