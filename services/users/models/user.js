const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // allowNull true untuk user Google
    },
    bio: {
        type: DataTypes.STRING,
    },
    profilePicture: {
        type: DataTypes.STRING,
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
}, {
    tableName: 'users'
});

module.exports = User;