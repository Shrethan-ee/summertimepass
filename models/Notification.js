const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Notification extends Model {}

Notification.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM(
            'idea_like',
            'idea_comment',
            'new_follower',
            'message_received',
            'collaboration_request',
            'investment_interest',
            'idea_shared',
            'mention',
            'system'
        ),
        allowNull: false
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
    related_user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    related_idea_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ideas',
            key: 'id'
        }
    },
    related_comment_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'comments',
            key: 'id'
        }
    },
    metadata: {
        type: DataTypes.JSON
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
    modelName: 'Notification',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            fields: ['user_id', 'is_read']
        },
        {
            fields: ['created_at']
        }
    ]
});

module.exports = Notification; 