const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Idea = require("./Idea");

const Comment = sequelize.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true, // For top-level comments
    },
}, {
    timestamps: true,
});

// Associations
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Comment.belongsTo(Idea, { foreignKey: "ideaId", as: "idea" });
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parentId" });
Comment.hasMany(Comment, { as: "replies", foreignKey: "parentId" });

module.exports = Comment;


