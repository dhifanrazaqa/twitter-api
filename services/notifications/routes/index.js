const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.patch('/read', notificationController.markAsRead);

module.exports = router;