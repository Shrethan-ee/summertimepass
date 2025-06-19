
const Group = require("../models/Group");
const GroupMembership = require("../models/GroupMembership");
const User = require("../models/User");

class GroupSerializer {
    static toRepresentation(group, currentUser = null, membership = null) {
        if (!group) return null;

        const isCreator = currentUser ? currentUser.id === group.creator_id : false;
        const isMember = membership ? membership.status === 'active' : false;
        const userRole = membership ? membership.role : null;

        return {
            id: group.id,
            name: group.name,
            description: group.description,
            category: group.category,
            privacy: group.privacy,
            image_url: group.image_url,
            member_count: group.member_count,
            creator_id: group.creator_id,
            rules: group.rules,
            is_active: group.is_active,
            created_at: group.created_at ? group.created_at.toISOString() : null,
            updated_at: group.updated_at ? group.updated_at.toISOString() : null,
            is_creator: isCreator,
            is_member: isMember,
            user_role: userRole
        };
    }
}

class GroupMembershipSerializer {
    static toRepresentation(membership) {
        if (!membership) return null;

        return {
            id: membership.id,
            user_id: membership.user_id,
            group_id: membership.group_id,
            role: membership.role,
            status: membership.status,
            joined_at: membership.joined_at ? membership.joined_at.toISOString() : null,
            user: membership.user ? {
                id: membership.user.id,
                username: membership.user.username,
                first_name: membership.user.first_name,
                last_name: membership.user.last_name,
                role: membership.user.role,
                profile_picture: membership.user.profile_picture
            } : null
        };
    }
}

class GroupCreateSerializer {
    static validateAndPrepare(data, currentUser) {
        const errors = {};

        if (!data.name || data.name.trim() === "") {
            errors.name = "Group name is required.";
        }
        if (!data.description || data.description.trim() === "") {
            errors.description = "Description is required.";
        }
        if (!data.category) {
            errors.category = "Category is required.";
        }

        const validCategories = ['startup', 'investor', 'networking', 'technology', 'industry', 'general'];
        if (data.category && !validCategories.includes(data.category)) {
            errors.category = "Invalid category.";
        }

        const validPrivacySettings = ['public', 'private', 'invite_only'];
        if (data.privacy && !validPrivacySettings.includes(data.privacy)) {
            errors.privacy = "Invalid privacy setting.";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        return {
            name: data.name.trim(),
            description: data.description.trim(),
            category: data.category,
            privacy: data.privacy || 'public',
            image_url: data.image_url || null,
            rules: data.rules || null,
            creator_id: currentUser.id
        };
    }
}

module.exports = {
    GroupSerializer,
    GroupMembershipSerializer,
    GroupCreateSerializer
};
