const User = require("../models/User");
const Idea = require("../models/Idea");
const Like = require("../models/Like");

const LikeType = {
    PUBLIC: 'public',
    INVESTOR: 'investor'
};

class LikeSerializer {
    static toRepresentation(like) {
        if (!like) return null;
        return {
            id: like.id,
            user: like.userId, 
            idea: like.ideaId, 
            like_type: like.likeType,
            created_at: like.createdAt ? like.createdAt.toISOString() : null
        };
    }

    static async validate(data, currentUser, findLike, findIdea) {
        const errors = {};

        const { idea_id, like_type } = data;

        if (!idea_id) {
            errors.idea_id = 'Idea ID is required.';
        }
        if (!like_type || ![LikeType.PUBLIC, LikeType.INVESTOR].includes(like_type)) {
            errors.like_type = `Invalid like type. Must be '${LikeType.PUBLIC}' or '${LikeType.INVESTOR}'.`;
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        const idea = await findIdea(idea_id);
        if (!idea) {
            errors.idea_id = 'Idea does not exist.';
            throw new Error(JSON.stringify(errors));
        }

        const existingLike = await findLike(currentUser.id, idea_id, like_type);
        if (existingLike) {
            errors.non_field_errors = `You have already ${like_type} liked this idea.`;
            throw new Error(JSON.stringify(errors));
        }

        if (like_type === LikeType.INVESTOR && currentUser.role !== 'investor') {
            errors.like_type = 'Only investors can give investor likes.';
            throw new Error(JSON.stringify(errors));
        }

        return { userId: currentUser.id, ideaId: idea_id, likeType: like_type };
    }

    static async create(validatedData, createLikeInDB) {
        const createdLike = await createLikeInDB(validatedData);
        return createdLike;
    }
}

class LikeCreateSerializer {
    static validate(data) {
        const errors = {};
        if (!data.idea_id) {
            errors.idea_id = 'Idea ID is required.';
        }
        if (!data.like_type || ![LikeType.PUBLIC, LikeType.INVESTOR].includes(data.like_type)) {
            errors.like_type = `Invalid like type. Must be '${LikeType.PUBLIC}' or '${LikeType.INVESTOR}'.`;
        }
        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }
        return data;
    }
}

module.exports = { LikeSerializer, LikeCreateSerializer, LikeType };


