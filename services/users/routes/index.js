const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { registerValidation, loginValidation, updateProfileValidation } = require('../middleware/validation');
const authenticate = require('../middleware/authenticate.js');

router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.get('/profile/:id', userController.getProfile);
router.put('/profile', authenticate, updateProfileValidation, userController.updateProfile);
router.delete('/account', authenticate, userController.deleteAccount);

module.exports = router;
