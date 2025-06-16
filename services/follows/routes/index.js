const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authenticate = require('../middleware/authenticate');
const { followValidation, paramValidation } = require('../middleware/validation');

router.post('/', authenticate, followValidation, followController.followUser);
router.delete('/:userId', authenticate, paramValidation, followController.unfollowUser);

router.get('/following/:userId', paramValidation, followController.getFollowing);
router.get('/followers/:userId', paramValidation, followController.getFollowers);

module.exports = router;