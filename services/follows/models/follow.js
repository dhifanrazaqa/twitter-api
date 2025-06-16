const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define('Follow', {
  followerId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  followingId: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
}, {
  tableName: 'follows',
  timestamps: true,
  updatedAt: false,
});

module.exports = Follow;