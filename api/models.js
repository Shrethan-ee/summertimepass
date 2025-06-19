class Category {
    constructor(name, description, createdAt) {
        this.name = name;
        this.description = description;
        this.createdAt = createdAt || new Date();
    }

    static fromJson(json) {
        return new Category(json.name, json.description, new Date(json.created_at));
    }

    toJson() {
        return {
            name: this.name,
            description: this.description,
            created_at: this.createdAt.toISOString()
        };
    }
}

class Tag {
    constructor(name, createdAt) {
        this.name = name;
        this.createdAt = createdAt || new Date();
    }

    static fromJson(json) {
        return new Tag(json.name, new Date(json.created_at));
    }

    toJson() {
        return {
            name: this.name,
            created_at: this.createdAt.toISOString()
        };
    }
}

class Idea {
    constructor(title, description, user, category, tags, publicLikesCount, investorLikesCount, commentsCount, createdAt, updatedAt) {
        this.title = title;
        this.description = description;
        this.user = user; // Assuming user ID or object
        this.category = category; // Assuming category ID or object
        this.tags = tags || []; // Array of tag IDs or objects
        this.publicLikesCount = publicLikesCount || 0;
        this.investorLikesCount = investorLikesCount || 0;
        this.commentsCount = commentsCount || 0;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    static fromJson(json) {
        return new Idea(
            json.title,
            json.description,
            json.user,
            json.category,
            json.tags,
            json.public_likes_count,
            json.investor_likes_count,
            json.comments_count,
            new Date(json.created_at),
            new Date(json.updated_at)
        );
    }

    toJson() {
        return {
            title: this.title,
            description: this.description,
            user: this.user,
            category: this.category,
            tags: this.tags,
            public_likes_count: this.publicLikesCount,
            investor_likes_count: this.investorLikesCount,
            comments_count: this.commentsCount,
            created_at: this.createdAt.toISOString(),
            updated_at: this.updatedAt.toISOString()
        };
    }

    updateLikesCount(publicCount, investorCount) {
        this.publicLikesCount = publicCount;
        this.investorLikesCount = investorCount;
        this.updatedAt = new Date();
    }

    updateCommentsCount(count) {
        this.commentsCount = count;
        this.updatedAt = new Date();
    }
}

class Like {
    static LikeType = {
        PUBLIC: 'public',
        INVESTOR: 'investor'
    };

    constructor(user, idea, likeType, createdAt) {
        this.user = user; // Assuming user ID or object
        this.idea = idea; // Assuming idea ID or object
        this.likeType = likeType;
        this.createdAt = createdAt || new Date();
    }

    static fromJson(json) {
        return new Like(json.user, json.idea, json.like_type, new Date(json.created_at));
    }

    toJson() {
        return {
            user: this.user,
            idea: this.idea,
            like_type: this.likeType,
            created_at: this.createdAt.toISOString()
        };
    }
}

class Comment {
    constructor(user, idea, parent, content, createdAt, updatedAt) {
        this.user = user; // Assuming user ID or object
        this.idea = idea; // Assuming idea ID or object
        this.parent = parent; // Assuming parent comment ID or null
        this.content = content;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    static fromJson(json) {
        return new Comment(
            json.user,
            json.idea,
            json.parent,
            json.content,
            new Date(json.created_at),
            new Date(json.updated_at)
        );
    }

    toJson() {
        return {
            user: this.user,
            idea: this.idea,
            parent: this.parent,
            content: this.content,
            created_at: this.createdAt.toISOString(),
            updated_at: this.updatedAt.toISOString()
        };
    }
}

module.exports = { Category, Tag, Idea, Like, Comment };


