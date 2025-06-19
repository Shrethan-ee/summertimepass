const User = require("../models/User");
const Comment = require("../models/Comment");

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

class RecursiveCommentSerializer {
    static toRepresentation(comment, allComments, currentUser = null) {
        if (!comment) return null;

        const replies = allComments.filter(reply => reply.parentId === comment.id)
                                   .map(reply => RecursiveCommentSerializer.toRepresentation(reply, allComments, currentUser));

        const isOwner = currentUser ? currentUser.id === comment.userId : false;

        return {
            id: comment.id,
            user: comment.user ? UserBriefSerializer.toRepresentation(comment.user) : null,
            idea: comment.ideaId,
            parent: comment.parentId,
            content: comment.content,
            replies: replies,
            created_at: comment.createdAt ? comment.createdAt.toISOString() : null,
            updated_at: comment.updatedAt ? comment.updatedAt.toISOString() : null,
            is_owner: isOwner
        };
    }
}

class CommentSerializer {
    static toRepresentation(comment, allComments = [], currentUser = null) {
        return RecursiveCommentSerializer.toRepresentation(comment, allComments, currentUser);
    }
}

class CommentCreateSerializer {
    static validate(data) {
        const errors = {};

        if (!data.content || data.content.trim() === "") {
            errors.content = "Content cannot be empty.";
        }
        if (!data.idea) {
            errors.idea = "Idea is required.";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }
        return data;
    }

    static create(validatedData, user) {
        return {
            ...validatedData,
            userId: user.id,
        };
    }
}

class CommentListSerializer {
    static toRepresentation(comment) {
        if (!comment) return null;
        return {
            id: comment.id,
            user: comment.user ? UserBriefSerializer.toRepresentation(comment.user) : null,
            idea: comment.ideaId,
            parent: comment.parentId,
            content: comment.content,
            created_at: comment.createdAt ? comment.createdAt.toISOString() : null,
            reply_count: comment.replies ? comment.replies.length : 0
        };
    }
}

module.exports = { UserBriefSerializer, CommentSerializer, CommentCreateSerializer, CommentListSerializer };


