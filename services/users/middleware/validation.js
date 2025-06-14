const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("email").isEmail().withMessage("Email tidak valid"),
  body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal harus 6 karakter"),
  handleValidationErrors,
];

const loginValidation = [
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").notEmpty().withMessage("Password tidak boleh kosong"),
  handleValidationErrors,
];

const updateProfileValidation = [
  body("name").optional().notEmpty().withMessage("Nama tidak boleh kosong"),
  body("bio").optional().isString().withMessage("Bio harus berupa teks"),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
};
