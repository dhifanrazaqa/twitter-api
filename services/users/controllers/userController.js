const User = require("../models/user");
const bcrypt = require("bcrypt");
const axios = require("axios");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    res
      .status(201)
      .json({ message: "User berhasil dibuat", user: userResponse });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("Email atau password salah");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Email atau password salah");
      error.statusCode = 401;
      throw error;
    }

    const authServiceUrl = "http://auth-service:5002/token/";

    let tokenResponse;
    try {
      tokenResponse = await axios.post(authServiceUrl, {
        userId: user.id,
      });
    } catch (authError) {
      const error = new Error(
        console.log(authError),
        "Gagal memproses autentikasi, silakan coba lagi."
      );
      error.statusCode = 503;
      throw error;
    }

    res.status(200).json({
      message: "Login berhasil",
      token: tokenResponse.data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "bio", "profilePicture", "createdAt"],
    });

    if (!user) {
      const error = new Error("User tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      const error = new Error("Unauthorized: User ID tidak ditemukan");
      error.statusCode = 401;
      throw error;
    }

    const { name, bio } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      const error = new Error("User tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    await user.save();

    res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: { id: user.id, name: user.name, bio: user.bio },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      const error = new Error("Unauthorized: User ID tidak ditemukan");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("User tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }

    await user.destroy();
    res.status(200).json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    next(error);
  }
};
