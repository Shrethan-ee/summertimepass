const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require("./User");
const Category = require("./Category");
const Tag = require("./Tag");

class Idea extends Model {}

Idea.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    public_likes_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    investor_likes_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    comments_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // New fields
    funding_status: {
        type: DataTypes.ENUM('idea', 'prototype', 'mvp', 'revenue', 'scaling'),
        defaultValue: 'idea'
    },
    funding_required: {
        type: DataTypes.DECIMAL(15, 2)
    },
    funding_raised: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0
    },
    market_size: {
        type: DataTypes.DECIMAL(15, 2)
    },
    team_size: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    team_roles: {
        type: DataTypes.JSON
    },
    milestones: {
        type: DataTypes.JSON
    },
    attachments: {
        type: DataTypes.JSON
    },
    progress_updates: {
        type: DataTypes.JSON
    },
    collaboration_requests: {
        type: DataTypes.JSON
    },
    views_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bookmarks_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    shares_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
    },
    visibility: {
        type: DataTypes.ENUM('public', 'private', 'connections'),
        defaultValue: 'public'
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
    modelName: 'Idea',
    timestamps: true,
    underscored: true
});

// Associations
Idea.belongsTo(User, { foreignKey: "userId", as: "user" });
Idea.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Idea.belongsToMany(Tag, { through: "IdeaTags", foreignKey: "ideaId", otherKey: "tagId" });

module.exports = Idea;


