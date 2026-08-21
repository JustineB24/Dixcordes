const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Chat = sequelize.define('Chat', {
        pseudo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        room: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'chats',
        timestamps: true
    });

    return Chat;
};