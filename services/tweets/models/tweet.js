const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const Tweet = sequelize.define(
  "Tweet",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(280),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    replyToTweetId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "tweets",
        key: "id",
      },
    },
  },
  {
    tableName: "tweets",
    timestamps: true,
  }
);

Tweet.hasMany(Tweet, { as: 'replies', foreignKey: 'replyToTweetId', onDelete: 'CASCADE' });
Tweet.belongsTo(Tweet, { as: 'replyTo', foreignKey: 'replyToTweetId' });

module.exports = Tweet;
