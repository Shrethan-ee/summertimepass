const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Message extends Model {}

Message.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    read_at: {
        type: DataTypes.DATE
    },
    attachments: {
        type: DataTypes.JSON
    },
    message_type: {
        type: DataTypes.ENUM('text', 'image', 'file', 'idea_share'),
        defaultValue: 'text'
    },
    related_idea_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ideas',
            key: 'id'
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Message',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['sender_id', 'receiver_id']
        },
        {
            fields: ['created_at']
        }
    ]
});

module.exports = Message; 