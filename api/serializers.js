const User = require("../models/User");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Idea = require("../models/Idea");
const Like = require("../models/Like");

const LikeType = {
    PUBLIC: 'public',
    INVESTOR: 'investor'
};

class UserBriefSerializer {
    static toRepresentation(user) {
        if (!user) return null;
        return {
            id: user.id,
            username: user.username,
            role: user.role
        };
    }
}

class CategorySerializer {
    static toRepresentation(category) {
        if (!category) return null;
        return {
            id: category.id,
            name: category.name,
            description: category.description
        };
    }

    static fromJson(json) {
        return {
            id: json.id,
            name: json.name,
            description: json.description
        };
    }
}

class TagSerializer {
    static toRepresentation(tag) {
        if (!tag) return null;
        return {
            id: tag.id,
            name: tag.name
        };
    }

    static fromJson(json) {
        return {
            id: json.id,
            name: json.name
        };
    }
}

class IdeaCreateSerializer {
    static async validateAndPrepare(data, currentUser, findCategoryById, getOrCreateTag) {
        const errors = {};

        if (!data.title || data.title.trim() === "") {
            errors.title = "Title is required.";
        }
        if (!data.description || data.description.trim() === "") {
            errors.description = "Description is required.";
        }
        if (!data.category) {
            errors.category = "Category is required.";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        const category = await findCategoryById(data.category);
        if (!category) {
            errors.category = "Category does not exist.";
            throw new Error(JSON.stringify(errors));
        }

        const tagsData = data.tags || [];
        const processedTags = [];
        for (const tagName of tagsData) {
            const tag = await getOrCreateTag(tagName.toLowerCase().trim());
            processedTags.push(tag.id); // Assuming getOrCreateTag returns an object with an ID
        }

        return {
            title: data.title,
            description: data.description,
            user: currentUser.id, // Assign current user's ID
            category: category.id, // Assign category ID
            tags: processedTags,
            publicLikesCount: 0,
            investorLikesCount: 0,
            commentsCount: 0,
        };
    }
}

class IdeaDetailSerializer {
    static toRepresentation(idea, currentUser = null, allLikes = []) {
        if (!idea) return null;

        const isOwner = currentUser ? currentUser.id === idea.userId : false;

        const hasLikedPublic = currentUser && allLikes.some(like =>
            like.userId === currentUser.id && like.ideaId === idea.id && like.likeType === LikeType.PUBLIC
        );

        let hasLikedInvestor = false;
        if (currentUser && currentUser.role === 'investor') {
            hasLikedInvestor = allLikes.some(like =>
                like.userId === currentUser.id && like.ideaId === idea.id && like.likeType === LikeType.INVESTOR
            );
        }

        return {
            id: idea.id,
            title: idea.title,
            description: idea.description,
            user: idea.user ? UserBriefSerializer.toRepresentation(idea.user) : null,
            category: idea.category ? CategorySerializer.toRepresentation(idea.category) : null,
            tags: idea.Tags ? idea.Tags.map(tag => TagSerializer.toRepresentation(tag)) : [],
            public_likes_count: idea.publicLikesCount,
            investor_likes_count: idea.investorLikesCount,
            comments_count: idea.commentsCount,
            created_at: idea.createdAt ? idea.createdAt.toISOString() : null,
            updated_at: idea.updatedAt ? idea.updatedAt.toISOString() : null,
            is_owner: isOwner,
            has_liked_public: hasLikedPublic,
            has_liked_investor: hasLikedInvestor
        };
    }
}

class IdeaListSerializer {
    static toRepresentation(idea) {
        if (!idea) return null;
        return {
            id: idea.id,
            title: idea.title,
            description: idea.description,
            user: idea.user ? UserBriefSerializer.toRepresentation(idea.user) : null,
            category: idea.category ? CategorySerializer.toRepresentation(idea.category) : null,
            tags: idea.Tags ? idea.Tags.map(tag => TagSerializer.toRepresentation(tag)) : [],
            public_likes_count: idea.publicLikesCount,
            investor_likes_count: idea.investorLikesCount,
            comments_count: idea.commentsCount,
            created_at: idea.createdAt ? idea.createdAt.toISOString() : null
        };
    }
}

module.exports = {
    UserBriefSerializer,
    CategorySerializer,
    TagSerializer,
    IdeaCreateSerializer,
    IdeaDetailSerializer,
    IdeaListSerializer
};


