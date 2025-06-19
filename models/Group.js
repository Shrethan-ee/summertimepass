
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Group extends Model {}

Group.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('startup', 'investor', 'networking', 'technology', 'industry', 'general'),
        allowNull: false
    },
    privacy: {
        type: DataTypes.ENUM('public', 'private', 'invite_only'),
        defaultValue: 'public'
    },
    image_url: {
        type: DataTypes.STRING
    },
    member_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    rules: {
        type: DataTypes.TEXT
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    modelName: 'Group',
    timestamps: true,
    underscored: true
});

module.exports = Group;
