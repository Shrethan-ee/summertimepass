const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tag = sequelize.define("Tag", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
});

module.exports = Tag;


