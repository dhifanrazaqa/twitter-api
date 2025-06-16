const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const authenticate = require("../middleware/authenticate");
const {
  createTweetValidation,
  updateTweetValidation,
  timelineValidation,
} = require("../middleware/validation");

router.post("/", authenticate, createTweetValidation, tweetController.createTweet);
router.get("/timeline", authenticate, timelineValidation, tweetController.getTimeline);

router.put("/:id", authenticate, updateTweetValidation, tweetController.updateTweet);
router.delete("/:id", authenticate, tweetController.deleteTweet);
router.get("/:id/replies", authenticate, tweetController.getRepliesForTweet);

module.exports = router;
