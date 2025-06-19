// This is a conceptual `server.js` file for a Node.js/Express application.
// It demonstrates how the converted JavaScript modules (models, serializers, views)
// would conceptually fit together. This is NOT a fully functional server,
// as it lacks actual database integration, robust error handling, and complete API logic.

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken"); // For conceptual JWT handling
const bcrypt = require("bcryptjs"); // For conceptual password hashing
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

// Import routes
const authRoutes = require('./users/serializers');
const User = require('./models/User');
const Category = require('./models/Category');
const Tag = require('./models/Tag');
const Idea = require('./models/Idea');
const Like = require('./models/Like');
const Comment = require('./models/Comment');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const Group = require('./models/Group');
const GroupMembership = require('./models/GroupMembership');

// Import conceptual modules (serializers and feed functions)
const { UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer, UserUpdateSerializer } = require("./users/serializers");
const { CategorySerializer, TagSerializer, IdeaCreateSerializer, IdeaDetailSerializer, IdeaListSerializer } = require("./api/serializers");
const { LikeSerializer, LikeCreateSerializer, LikeType } = require("./api/like_serializers");
const { CommentSerializer, CommentCreateSerializer, CommentListSerializer } = require("./api/comment_serializers");
const { rankIdeasByInvestorLikes, rankIdeasByPublicLikes, rankIdeasByComments, rankIdeasByRecency, rankIdeasByTrending, rankIdeasComprehensive } = require("./api/feed");

// --- Middleware ---

// Authentication Middleware
const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ detail: "Authentication credentials were not provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ detail: "Authentication token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.user_id);
        if (!req.user) {
            return res.status(401).json({ detail: "User not found." });
        }
        next();
    } catch (error) {
        return res.status(401).json({ detail: "Invalid or expired token." });
    }
};

// Authorization Middleware (IsOwnerOrReadOnly)
const isOwnerOrReadOnly = (model) => async (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
        return next();
    }

    let obj;
    try {
        obj = await model.findByPk(req.params.id);
    } catch (error) {
        return res.status(500).json({ detail: "Error fetching object for ownership check." });
    }

    if (!obj) {
        return res.status(404).json({ detail: `${model.name} not found.` });
    }

    if (obj.userId && req.user && obj.userId === req.user.id) {
        req.object = obj; // Attach the fetched object to the request
        next();
    } else {
        res.status(403).json({ detail: "Permission denied. You are not the owner." });
    }
};

// Authorization Middleware (IsEntrepreneurOrReadOnly)
const isEntrepreneurOrReadOnly = (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
        return next();
    }
    if (req.user && req.user.role === "entrepreneur") {
        next();
    } else {
        res.status(403).json({ detail: "Permission denied. Only entrepreneurs can perform this action." });
    }
};

// Authorization Middleware (IsAdminUser)
const isAdminUser = (req, res, next) => {
    if (req.user && req.user.isStaff) {
        next();
    } else {
        res.status(403).json({ detail: "Permission denied. Admin access required." });
    }
};

// Authorization Middleware (IsInvestor)
const isInvestor = (req, res, next) => {
    if (req.user && req.user.role === "investor") {
        next();
    } else {
        res.status(403).json({ detail: "Permission denied. Only investors can perform this action." });
    }
};

// --- Express App Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json()); // To parse JSON request bodies

// Health check route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Startup Platform API is running", version: "1.0.0" });
});

// --- API Routes ---

// User Authentication and Registration
app.post("/api/register", async (req, res) => {
    try {
        const validatePassword = (password) => {
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long.");
            }
        };
        const findUserByUsernameOrEmail = async (username, email) => {
            return await User.findOne({ where: { username } }) || await User.findOne({ where: { email } });
        };
        const hashPassword = async (password) => {
            const salt = await bcrypt.genSalt(10);
            return bcrypt.hash(password, salt);
        };
        const createUserInDB = async (userData) => {
            return await User.create(userData);
        };

        const validatedData = await UserRegistrationSerializer.validate(req.body, validatePassword, findUserByUsernameOrEmail);
        const newUser = await UserRegistrationSerializer.create(validatedData, hashPassword, createUserInDB);
        res.status(201).json(UserSerializer.toRepresentation(newUser));
    } catch (error) {
        res.status(400).json({ detail: JSON.parse(error.message) });
    }
});

app.post("/api/token/obtain", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ detail: "Invalid credentials." });
    }

    const payload = CustomTokenObtainPairSerializer.getTokenPayload(user);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ access: token });
});

// User Profile
app.get("/api/users/me", isAuthenticated, (req, res) => {
    res.status(200).json(UserSerializer.toRepresentation(req.user));
});

app.put("/api/users/me", isAuthenticated, async (req, res) => {
    try {
        const updatedUser = await UserUpdateSerializer.validateAndUpdate(req.user, req.body);
        await updatedUser.save(); // Save updated user to database
        res.status(200).json(UserSerializer.toRepresentation(updatedUser));
    } catch (error) {
        res.status(400).json({ detail: JSON.parse(error.message) });
    }
});

// Categories
app.get("/api/categories", async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories.map(CategorySerializer.toRepresentation));
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

app.post("/api/categories", isAuthenticated, isAdminUser, async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(CategorySerializer.toRepresentation(newCategory));
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

// Tags
app.get("/api/tags", async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.status(200).json(tags.map(TagSerializer.toRepresentation));
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

app.post("/api/tags", isAuthenticated, isAdminUser, async (req, res) => {
    try {
        const newTag = await Tag.create(req.body);
        res.status(201).json(TagSerializer.toRepresentation(newTag));
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

// Ideas
app.get("/api/ideas", async (req, res) => {
    try {
        let queryOptions = {
            include: [{ model: User, as: "user" }, { model: Category, as: "category" }, { model: Tag }],
        };

        if (req.query.category) {
            queryOptions.where = { ...queryOptions.where, categoryId: req.query.category };
        }
        if (req.query.user) {
            queryOptions.where = { ...queryOptions.where, userId: req.query.user };
        }
        if (req.query.tag) {
            queryOptions.include[2].where = { id: req.query.tag };
        }

        let ideas = await Idea.findAll(queryOptions);

        // Apply ranking if specified
        if (req.query.rank_by) {
            switch (req.query.rank_by) {
                case "popular":
                    ideas.sort((a, b) => (b.publicLikesCount + b.investorLikesCount) - (a.publicLikesCount + a.investorLikesCount));
                    break;
                case "recent":
                    ideas = rankIdeasByRecency(ideas);
                    break;
                case "trending":
                    ideas = rankIdeasByTrending(ideas, parseInt(req.query.days) || 7);
                    break;
                case "investor_likes":
                    ideas = rankIdeasByInvestorLikes(ideas);
                    break;
                case "public_likes":
                    ideas = rankIdeasByPublicLikes(ideas);
                    break;
                case "most_commented":
                    ideas = rankIdeasByComments(ideas);
                    break;
                case "recommended":
                    ideas = rankIdeasComprehensive(ideas);
                    break;
            }
        }

        res.status(200).json(ideas.map(idea => IdeaListSerializer.toRepresentation(idea)));
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

app.post("/api/ideas", isAuthenticated, isEntrepreneurOrReadOnly, async (req, res) => {
    try {
        const findCategoryById = async (id) => await Category.findByPk(id);
        const getOrCreateTag = async (name) => {
            let [tag] = await Tag.findOrCreate({ where: { name }, defaults: { name } });
            return tag;
        };

        const validatedData = await IdeaCreateSerializer.validateAndPrepare(req.body, req.user, findCategoryById, getOrCreateTag);
        const newIdea = await Idea.create({
            title: validatedData.title,
            description: validatedData.description,
            userId: validatedData.user,
            categoryId: validatedData.category,
            publicLikesCount: validatedData.publicLikesCount,
            investorLikesCount: validatedData.investorLikesCount,
            commentsCount: validatedData.commentsCount,
        });
        await newIdea.setTags(validatedData.tags); // Associate tags

        res.status(201).json(IdeaDetailSerializer.toRepresentation(newIdea));
    } catch (error) {
        res.status(400).json({ detail: JSON.parse(error.message) });
    }
});

app.get("/api/ideas/:id", async (req, res) => {
    try {
        const idea = await Idea.findByPk(req.params.id, { include: [{ model: User, as: "user" }, { model: Category, as: "category" }, { model: Tag }] });
        if (!idea) return res.status(404).json({ detail: "Idea not found." });
        const likes = await Like.findAll({ where: { ideaId: idea.id } });
        res.status(200).json(IdeaDetailSerializer.toRepresentation(idea, req.user, likes));
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

app.put("/api/ideas/:id", isAuthenticated, isOwnerOrReadOnly(Idea), async (req, res) => {
    try {
        const idea = req.object; // Fetched by isOwnerOrReadOnly middleware
        const updatedIdea = await idea.update(req.body);
        res.status(200).json(IdeaDetailSerializer.toRepresentation(updatedIdea));
    } catch (error) {
        res.status(400).json({ detail: error.message });
    }
});

app.delete("/api/ideas/:id", isAuthenticated, isOwnerOrReadOnly(Idea), async (req, res) => {
    try {
        const idea = req.object; // Fetched by isOwnerOrReadOnly middleware
        await idea.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

// Likes
app.post("/api/likes/toggle", isAuthenticated, async (req, res) => {
    try {
        const { idea_id, like_type } = req.body;
        const userId = req.user.id;

        const findLike = async (userId, ideaId, likeType) => await Like.findOne({ where: { userId, ideaId, likeType } });
        const findIdea = async (id) => await Idea.findByPk(id);
        const createLikeInDB = async (likeData) => {
            const newLike = await Like.create(likeData);
            const idea = await Idea.findByPk(newLike.ideaId);
            if (idea) {
                if (newLike.likeType === LikeType.PUBLIC) idea.publicLikesCount++;
                if (newLike.likeType === LikeType.INVESTOR) idea.investorLikesCount++;
                await idea.save();
            }
            return newLike;
        };

        const existingLike = await findLike(userId, idea_id, like_type);

        if (existingLike) {
            await existingLike.destroy();
            const idea = await Idea.findByPk(idea_id);
            if (idea) {
                if (existingLike.likeType === LikeType.PUBLIC) idea.publicLikesCount--;
                if (existingLike.likeType === LikeType.INVESTOR) idea.investorLikesCount--;
                await idea.save();
            }
            return res.status(204).json({ detail: "Like removed." });
        } else {
            const validatedData = await LikeSerializer.validate({ idea_id, like_type }, req.user, findLike, findIdea);
            const newLike = await LikeSerializer.create({ ...validatedData, userId: userId, ideaId: idea_id }, createLikeInDB);
            return res.status(201).json(LikeSerializer.toRepresentation(newLike, req.user));
        }
    } catch (error) {
        res.status(400).json({ detail: JSON.parse(error.message) });
    }
});

// Comments
app.get("/api/ideas/:idea_id/comments", async (req, res) => {
    try {
        const ideaId = parseInt(req.params.idea_id);
        const comments = await Comment.findAll({ where: { ideaId, parentId: null }, include: [{ model: User, as: "user" }] });
        res.status(200).json(comments.map(comment => CommentListSerializer.toRepresentation(comment)));
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

app.post("/api/ideas/:idea_id/comment", isAuthenticated, async (req, res) => {
    try {
        const ideaId = parseInt(req.params.idea_id);
        const idea = await Idea.findByPk(ideaId);
        if (!idea) return res.status(404).json({ detail: "Idea not found." });

        const validatedData = CommentCreateSerializer.validate({ ...req.body, idea: ideaId });
        const newComment = await Comment.create({ ...validatedData, userId: req.user.id, ideaId: ideaId });

        idea.commentsCount++;
        await idea.save();

        res.status(201).json(CommentSerializer.toRepresentation(newComment));
    } catch (error) {
        res.status(400).json({ detail: JSON.parse(error.message) });
    }
});

app.get("/api/comments/:comment_id/replies", async (req, res) => {
    try {
        const commentId = parseInt(req.params.comment_id);
        const replies = await Comment.findAll({ where: { parentId: commentId }, include: [{ model: User, as: "user" }] });
        res.status(200).json(replies.map(reply => CommentListSerializer.toRepresentation(reply)));
    } catch (error) {
        res.status(500).json({ detail: error.message });
    }
});

app.post("/api/ideas/:idea_id/comments/:comment_id/reply", isAuthenticated, async (req, res) => {
    try {
        const ideaId = parseInt(req.params.idea_id);
        const parentCommentId = parseInt(req.params.comment_id);

        const idea = await Idea.findByPk(ideaId);
        if (!idea) return res.status(404).json({ detail: "Idea not found." });

        const parentComment = await Comment.findByPk(parentCommentId);
        if (!parentComment) return res.status(404).json({ detail: "Parent comment not found." });
        if (parentComment.ideaId !== ideaId) return res.status(400).json({ detail: "Parent comment does not belong to this idea." });

        const validatedData = CommentCreateSerializer.validate({ ...req.body, idea: ideaId, parent: parentCommentId });
        const newReply = await Comment.create({ ...validatedData, userId: req.user.id, ideaId: ideaId, parentId: parentCommentId });

        idea.commentsCount++;
        await idea.save();

        res.status(201).json(CommentSerializer.toRepresentation(newReply));
    } catch (error) {
        res.status(400).json({ detail: JSON.parse(error.message) });
    }
});

// Define model associations
User.hasMany(Idea, { foreignKey: 'userId', as: 'ideas' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Group, { foreignKey: 'creator_id', as: 'createdGroups' });
User.hasMany(GroupMembership, { foreignKey: 'user_id', as: 'groupMemberships' });

Idea.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Idea.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Idea.belongsToMany(Tag, { through: 'IdeaTags', foreignKey: 'ideaId' });
Idea.hasMany(Like, { foreignKey: 'ideaId', as: 'likes' });
Idea.hasMany(Comment, { foreignKey: 'ideaId', as: 'comments' });

Category.hasMany(Idea, { foreignKey: 'categoryId', as: 'ideas' });

Tag.belongsToMany(Idea, { through: 'IdeaTags', foreignKey: 'tagId' });

Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Like.belongsTo(Idea, { foreignKey: 'ideaId', as: 'idea' });

Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Idea, { foreignKey: 'ideaId', as: 'idea' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Group.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });
Group.hasMany(GroupMembership, { foreignKey: 'group_id', as: 'memberships' });

GroupMembership.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
GroupMembership.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });

// Import API views
const { categoryController, tagController, ideaController, isAuthenticated, isEntrepreneurOrReadOnly, isOwnerOrReadOnly, isAdminUser } = require('./api/views');
const { likeController } = require('./api/like_views');
const { commentController } = require('./api/comment_views');
const { groupController } = require('./api/group_views');

// Comment routes
app.get('/api/ideas/:id/comments', commentController.getComments);
app.post('/api/ideas/:id/comments', isAuthenticated, commentController.createComment);
app.put('/api/comments/:id', isAuthenticated, commentController.updateComment);
app.delete('/api/comments/:id', isAuthenticated, commentController.deleteComment);

// Group routes
app.get('/api/groups', groupController.listGroups);
app.get('/api/groups/:id', groupController.getGroup);
app.post('/api/groups', isAuthenticated, groupController.createGroup);
app.post('/api/groups/:id/join', isAuthenticated, groupController.joinGroup);
app.delete('/api/groups/:id/leave', isAuthenticated, groupController.leaveGroup);
app.get('/api/groups/:id/members', groupController.getGroupMembers);
app.get('/api/user/groups', isAuthenticated, groupController.getUserGroups);

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});