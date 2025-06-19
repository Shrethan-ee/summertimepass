const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Idea = require("./Idea");

const Like = sequelize.define("Like", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    likeType: {
        type: DataTypes.ENUM("public", "investor"),
        allowNull: false,
    },
}, {
    timestamps: true,
});

// Associations
Like.belongsTo(User, { foreignKey: "userId", as: "user" });
Like.belongsTo(Idea, { foreignKey: "ideaId", as: "idea" });

module.exports = Like;


