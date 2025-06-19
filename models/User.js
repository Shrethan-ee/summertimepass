const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('entrepreneur', 'investor', 'public'),
        allowNull: false
    },
    bio: {
        type: DataTypes.TEXT
    },
    profile_picture: {
        type: DataTypes.STRING
    },
    company_name: {
        type: DataTypes.STRING
    },
    investment_focus: {
        type: DataTypes.STRING
    },
    // New fields
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verification_badge: {
        type: DataTypes.STRING
    },
    linkedin_url: {
        type: DataTypes.STRING
    },
    twitter_url: {
        type: DataTypes.STRING
    },
    website_url: {
        type: DataTypes.STRING
    },
    skills: {
        type: DataTypes.JSON
    },
    expertise_areas: {
        type: DataTypes.JSON
    },
    investment_history: {
        type: DataTypes.JSON
    },
    startup_history: {
        type: DataTypes.JSON
    },
    location: {
        type: DataTypes.STRING
    },
    industry_focus: {
        type: DataTypes.JSON
    },
    investment_range: {
        type: DataTypes.JSON
    },
    portfolio_companies: {
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
    modelName: 'User',
    timestamps: true,
    underscored: true
});

module.exports = User;


