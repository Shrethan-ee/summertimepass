// This file contains JavaScript equivalents for the idea ranking functions defined in feed.py.
// These functions are designed to operate on an array of 'Idea' objects, which would typically
// be fetched from a database in a real-world Node.js application.

// Assuming 'Idea' objects have properties like:
// id, title, description, user, category, tags, publicLikesCount, investorLikesCount, commentsCount, createdAt, updatedAt

/**
 * Ranks ideas based on investor likes.
 * @param {Array<Object>} ideas - An array of Idea objects.
 * @returns {Array<Object>} A new array of ideas sorted by investor likes count (descending) and then by creation date (descending).
 */
function rankIdeasByInvestorLikes(ideas) {
    if (!ideas) return [];
    return [...ideas].sort((a, b) => {
        if (b.investorLikesCount !== a.investorLikesCount) {
            return b.investorLikesCount - a.investorLikesCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Ranks ideas based on public likes.
 * @param {Array<Object>} ideas - An array of Idea objects.
 * @returns {Array<Object>} A new array of ideas sorted by public likes count (descending) and then by creation date (descending).
 */
function rankIdeasByPublicLikes(ideas) {
    if (!ideas) return [];
    return [...ideas].sort((a, b) => {
        if (b.publicLikesCount !== a.publicLikesCount) {
            return b.publicLikesCount - a.publicLikesCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Ranks ideas based on comment count.
 * @param {Array<Object>} ideas - An array of Idea objects.
 * @returns {Array<Object>} A new array of ideas sorted by comment count (descending) and then by creation date (descending).
 */
function rankIdeasByComments(ideas) {
    if (!ideas) return [];
    return [...ideas].sort((a, b) => {
        if (b.commentsCount !== a.commentsCount) {
            return b.commentsCount - a.commentsCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Ranks ideas based on recency.
 * @param {Array<Object>} ideas - An array of Idea objects.
 * @returns {Array<Object>} A new array of ideas sorted by creation date (descending).
 */
function rankIdeasByRecency(ideas) {
    if (!ideas) return [];
    return [...ideas].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Ranks ideas based on recent activity (trending).
 * @param {Array<Object>} ideas - An array of Idea objects.
 * @param {number} [days=7] - The number of days to consider for recent activity.
 * @returns {Array<Object>} A new array of ideas filtered by recent activity and sorted.
 */
function rankIdeasByTrending(ideas, days = 7) {
    if (!ideas) return [];
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - days);

    const filteredIdeas = ideas.filter(idea => new Date(idea.createdAt) >= recentDate);

    return [...filteredIdeas].sort((a, b) => {
        // Primary sort by public likes, then investor likes, then comments, then recency
        if (b.publicLikesCount !== a.publicLikesCount) {
            return b.publicLikesCount - a.publicLikesCount;
        }
        if (b.investorLikesCount !== a.investorLikesCount) {
            return b.investorLikesCount - a.investorLikesCount;
        }
        if (b.commentsCount !== a.commentsCount) {
            return b.commentsCount - a.commentsCount;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/**
 * Ranks ideas based on a comprehensive algorithm.
 * Score = (investor_likes * 3) + public_likes + (comments * 0.5) + recency_factor
 * @param {Array<Object>} ideas - An array of Idea objects.
 * @returns {Array<Object>} A new array of ideas sorted by the comprehensive score.
 */
function rankIdeasComprehensive(ideas) {
    if (!ideas) return [];
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return [...ideas].map(idea => {
        const createdAt = new Date(idea.createdAt);
        let recencyFactor = 0.0;

        if (createdAt >= thirtyDaysAgo) {
            const timeDiff = now.getTime() - createdAt.getTime(); // milliseconds
            const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
            recencyFactor = 1.0 - (timeDiff / thirtyDaysInMillis);
        }

        const score = (idea.investorLikesCount * 3.0) +
                      idea.publicLikesCount +
                      (idea.commentsCount * 0.5) +
                      recencyFactor;
        
        return { ...idea, score };
    }).sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

module.exports = {
    rankIdeasByInvestorLikes,
    rankIdeasByPublicLikes,
    rankIdeasByComments,
    rankIdeasByRecency,
    rankIdeasByTrending,
    rankIdeasComprehensive
};


