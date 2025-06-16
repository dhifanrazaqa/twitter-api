const Tweet = require("../models/tweet");
const logger = require("../config/logger");
const axios = require("axios");
const { Op } = require("sequelize");
const { publishEvent } = require("../utils/messageBroker");

exports.createTweet = async (req, res, next) => {
  try {
    const { content, replyToTweetId } = req.body;
    const userId = req.user.userId;

    let parentTweet = null;

    if (replyToTweetId) {
      parentTweet = await Tweet.findByPk(replyToTweetId);
      if (!parentTweet) {
        logger.warn(
          `User ${userId} mencoba membalas tweet ${replyToTweetId} yang tidak ada.`
        );
        return res
          .status(404)
          .json({ message: "Tweet yang ingin Anda balas tidak ditemukan." });
      }
    }
    const tweet = await Tweet.create({ content, userId, replyToTweetId });
    logger.info(`Tweet baru (${tweet.id}) dibuat oleh user ${userId}`);

    if (parentTweet) {
      if (parentTweet.userId !== userId) {
        publishEvent({
          type: "NEW_REPLY",
          data: {
            replierId: userId,
            originalPosterId: parentTweet.userId,
            replyTweetId: tweet.id,
          },
        });
        logger.info(
          `Event NEW_REPLY untuk tweet ${tweet.id} telah diterbitkan.`
        );
      }
    }

    res.status(201).json({ message: "Tweet berhasil dibuat", tweet });
  } catch (error) {
    next(error);
  }
};

exports.getTimeline = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let followingIds = [];
    try {
      const followServiceUrl = `http://follow-service:5004/following/${userId}`;
      const response = await axios.get(followServiceUrl);
      followingIds = response.data.map((item) => item.followingId);
    } catch (err) {
      logger.error(`Gagal menghubungi Follow Service: ${err.message}`);
    }

    const userIdsForTimeline = [userId, ...followingIds];

    const { count, rows } = await Tweet.findAndCountAll({
      where: {
        userId: {
          [Op.in]: userIdsForTimeline,
        },
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.status(200).json({
      message: "Berhasil mendapatkan timeline",
      totalTweets: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      tweets: rows,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.userId;
    const { content } = req.body;

    const tweet = await Tweet.findByPk(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet tidak ditemukan" });
    }

    if (tweet.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak. Anda bukan pemilik tweet ini." });
    }

    tweet.content = content;
    await tweet.save();

    logger.info(`Tweet ${tweetId} berhasil diperbarui oleh user ${userId}`);
    res.status(200).json({
      message: "Tweet berhasil diperbarui",
      tweet,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.userId;

    const tweet = await Tweet.findByPk(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet tidak ditemukan" });
    }

    if (tweet.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak. Anda bukan pemilik tweet ini." });
    }

    await tweet.destroy();
    logger.info(`Tweet ${tweetId} berhasil dihapus oleh user ${userId}`);
    res.status(200).json({
      message: "Tweet berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

exports.getRepliesForTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;

    const parentTweet = await Tweet.findByPk(tweetId);
    if (!parentTweet) {
      return res.status(404).json({ message: "Tweet tidak ditemukan." });
    }

    const replies = await Tweet.findAll({
      where: { replyToTweetId: tweetId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      message: "Berhasil mendapatkan balasan untuk tweet ini.",
      tweet: parentTweet,
      replies,
    });
  } catch (error) {
    next(error);
  }
};
