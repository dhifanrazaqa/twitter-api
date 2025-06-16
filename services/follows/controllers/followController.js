const axios = require("axios");

const Follow = require("../models/follow");
const logger = require("../config/logger");
const { publishEvent } = require('../utils/messageBroker');

exports.followUser = async (req, res, next) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.body;

    if (followerId === followingId) {
      return res
        .status(400)
        .json({ message: "Anda tidak bisa mengikuti diri sendiri." });
    }

    try {
      const userServiceUrl = `http://user-service:5001/profile/${followingId}`;
      await axios.get(userServiceUrl);
      logger.info(`Validasi berhasil: User ${followingId} ditemukan.`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        logger.warn(
          `Percobaan follow gagal: User ${followingId} tidak ditemukan.`
        );
        return res
          .status(404)
          .json({ message: "Pengguna yang ingin Anda ikuti tidak ditemukan." });
      }
      throw new Error("Gagal memvalidasi pengguna ke User Service.");
    }

    await Follow.create({ followerId, followingId });

    //Terbit event rabbitmq
    publishEvent({
      type: 'NEW_FOLLOWER',
      data: { followerId, followingId }
    });

    logger.info(`User ${followerId} mulai mengikuti ${followingId}`);
    res.status(201).json({ message: "Berhasil mengikuti pengguna." });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Anda sudah mengikuti pengguna ini." });
    }
    next(error);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.userId;
    const { userId: followingId } = req.params;

    const result = await Follow.destroy({
      where: { followerId, followingId },
    });

    if (result === 0) {
      return res
        .status(404)
        .json({ message: "Anda tidak sedang mengikuti pengguna ini." });
    }

    logger.info(`User ${followerId} berhenti mengikuti ${followingId}`);
    res.status(200).json({ message: "Berhasil berhenti mengikuti pengguna." });
  } catch (error) {
    next(error);
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followingList = await Follow.findAll({
      where: { followerId: userId },
      attributes: ["followingId", "createdAt"],
    });
    res
      .status(200)
      .json({ message: "Berhasil mendapatkan following", followingList });
  } catch (error) {
    next(error);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followersList = await Follow.findAll({
      where: { followingId: userId },
      attributes: ["followerId", "createdAt"],
    });
    res
      .status(200)
      .json({ message: "Berhasil mendapatkan followers", followersList });
  } catch (error) {
    next(error);
  }
};
