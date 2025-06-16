const Notification = require('../models/notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.status(200).json({
      message : 'Notifikasi berhasil diambil',
      notifications
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    res.status(200).json({ message: 'Semua notifikasi telah ditandai sebagai dibaca.' });
  } catch (error) {
    next(error);
  }
};