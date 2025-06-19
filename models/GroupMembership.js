
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class GroupMembership extends Model {}

GroupMembership.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Groups',
            key: 'id'
        }
    },
    role: {
        type: DataTypes.ENUM('member', 'moderator', 'admin', 'creator'),
        defaultValue: 'member'
    },
    status: {
        type: DataTypes.ENUM('active', 'pending', 'banned'),
        defaultValue: 'active'
    },
    joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
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
    modelName: 'GroupMembership',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'group_id']
        }
    ]
});

module.exports = GroupMembership;
