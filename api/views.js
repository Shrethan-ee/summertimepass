const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Idea = require("../models/Idea");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const User = require("../models/User");

const { CategorySerializer, TagSerializer, IdeaCreateSerializer, IdeaDetailSerializer, IdeaListSerializer } = require("../api/serializers");
const { rankIdeasByInvestorLikes, rankIdeasByPublicLikes, rankIdeasByComments, rankIdeasByRecency, rankIdeasByTrending, rankIdeasComprehensive } = require("./feed");

// Equivalent to IsEntrepreneurOrReadOnly permission
const isEntrepreneurOrReadOnly = (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
        return next();
    }
    if (req.user && req.user.role === "entrepreneur") {
        return next();
    }
    return res.status(403).json({ detail: "Permission denied. Only entrepreneurs can perform this action." });
};

// Equivalent to IsOwnerOrReadOnly permission
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

// Authentication middleware (e.g., using JWT)
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ detail: "Authentication credentials were not provided." });
    }
};

// Middleware to check if user is admin
const isAdminUser = (req, res, next) => {
    if (req.user && req.user.isStaff) {
        next();
    } else {
        res.status(403).json({ detail: "Permission denied. Admin access required." });
    }
};

const categoryController = {
    listCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.status(200).json(categories.map(CategorySerializer.toRepresentation));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },
    getCategory: async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.id);
            if (!category) return res.status(404).json({ detail: "Category not found." });
            res.status(200).json(CategorySerializer.toRepresentation(category));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            const newCategory = await Category.create(req.body);
            res.status(201).json(CategorySerializer.toRepresentation(newCategory));
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const updatedCategory = await Category.findByPk(req.params.id);
            if (!updatedCategory) return res.status(404).json({ detail: "Category not found." });
            await updatedCategory.update(req.body);
            res.status(200).json(CategorySerializer.toRepresentation(updatedCategory));
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const deletedCategory = await Category.findByPk(req.params.id);
            if (!deletedCategory) return res.status(404).json({ detail: "Category not found." });
            await deletedCategory.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
};

const tagController = {
    listTags: async (req, res) => {
        try {
            const tags = await Tag.findAll();
            res.status(200).json(tags.map(TagSerializer.toRepresentation));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },
    getTag: async (req, res) => {
        try {
            const tag = await Tag.findByPk(req.params.id);
            if (!tag) return res.status(404).json({ detail: "Tag not found." });
            res.status(200).json(TagSerializer.toRepresentation(tag));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },
    createTag: async (req, res) => {
        try {
            const newTag = await Tag.create(req.body);
            res.status(201).json(TagSerializer.toRepresentation(newTag));
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    },
    updateTag: async (req, res) => {
        try {
            const updatedTag = await Tag.findByPk(req.params.id);
            if (!updatedTag) return res.status(404).json({ detail: "Tag not found." });
            await updatedTag.update(req.body);
            res.status(200).json(TagSerializer.toRepresentation(updatedTag));
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    },
    deleteTag: async (req, res) => {
        try {
            const deletedTag = await Tag.findByPk(req.params.id);
            if (!deletedTag) return res.status(404).json({ detail: "Tag not found." });
            await deletedTag.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
};

const ideaController = {
    listIdeas: async (req, res) => {
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
    },
    getIdea: async (req, res) => {
        try {
            const idea = await Idea.findByPk(req.params.id, { include: [{ model: User, as: "user" }, { model: Category, as: "category" }, { model: Tag }] });
            if (!idea) return res.status(404).json({ detail: "Idea not found." });
            const likes = await Like.findAll({ where: { ideaId: idea.id } });
            res.status(200).json(IdeaDetailSerializer.toRepresentation(idea, req.user, likes));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },
    createIdea: async (req, res) => {
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
            res.status(400).json({ detail: error.message });
        }
    },
    updateIdea: async (req, res) => {
        try {
            const idea = req.object; // Fetched by isOwnerOrReadOnly middleware
            const updatedIdea = await idea.update(req.body);
            res.status(200).json(IdeaDetailSerializer.toRepresentation(updatedIdea));
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    },
    deleteIdea: async (req, res) => {
        try {
            const idea = req.object; // Fetched by isOwnerOrReadOnly middleware
            await idea.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    popular: async (req, res) => {
        try {
            const ideas = await Idea.findAll();
            const rankedIdeas = ideas.sort((a, b) => (b.publicLikesCount + b.investorLikesCount) - (a.publicLikesCount + a.investorLikesCount));
            res.status(200).json(rankedIdeas.map(idea => IdeaListSerializer.toRepresentation(idea)));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    recent: async (req, res) => {
        try {
            const ideas = await Idea.findAll();
            const rankedIdeas = rankIdeasByRecency(ideas);
            res.status(200).json(rankedIdeas.map(idea => IdeaListSerializer.toRepresentation(idea)));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    trending: async (req, res) => {
        try {
            const ideas = await Idea.findAll();
            const days = parseInt(req.query.days) || 7;
            const rankedIdeas = rankIdeasByTrending(ideas, days);
            res.status(200).json(rankedIdeas.map(idea => IdeaListSerializer.toRepresentation(idea)));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    investor_likes: async (req, res) => {
        try {
            const ideas = await Idea.findAll();
            const rankedIdeas = rankIdeasByInvestorLikes(ideas);
            res.status(200).json(rankedIdeas.map(idea => IdeaListSerializer.toRepresentation(idea)));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    public_likes: async (req, res) => {
        try {
            const ideas = await Idea.findAll();
            const rankedIdeas = rankIdeasByPublicLikes(ideas);
            res.status(200).json(rankedIdeas.map(idea => IdeaListSerializer.toRepresentation(idea)));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    most_commented: async (req, res) => {
        try {
            const ideas = await Idea.findAll();
            const rankedIdeas = rankIdeasByComments(ideas);
            res.status(200).json(rankedIdeas.map(idea => IdeaListSerializer.toRepresentation(idea)));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    recommended: async (req, res) => {
        try {
            const ideas = await Idea.findAll();
            const rankedIdeas = rankIdeasComprehensive(ideas);
            res.status(200).json(rankedIdeas.map(idea => IdeaListSerializer.toRepresentation(idea)));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
};

module.exports = { isEntrepreneurOrReadOnly, isOwnerOrReadOnly, isAuthenticated, isAdminUser, categoryController, tagController, ideaController };


