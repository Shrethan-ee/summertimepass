const sequelize = require("./config/database");
const User = require("./models/User");
const Category = require("./models/Category");
const Tag = require("./models/Tag");
const Idea = require("./models/Idea");
const Like = require("./models/Like");
const Comment = require("./models/Comment");

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log("Connection to database has been established successfully.");

        // Define associations
        User.hasMany(Idea, { foreignKey: "userId" });
        User.hasMany(Like, { foreignKey: "userId" });
        User.hasMany(Comment, { foreignKey: "userId" });

        Category.hasMany(Idea, { foreignKey: "categoryId" });

        Tag.belongsToMany(Idea, { through: "IdeaTags", foreignKey: "tagId", otherKey: "ideaId" });

        Idea.hasMany(Like, { foreignKey: "ideaId" });
        Idea.hasMany(Comment, { foreignKey: "ideaId" });

        // Sync all models
        await sequelize.sync({ force: true }); // `force: true` will drop the table if it already exists
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database or synchronize models:", error);
    }
}

syncDatabase();


