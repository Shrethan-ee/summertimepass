
const Group = require("../models/Group");
const GroupMembership = require("../models/GroupMembership");
const User = require("../models/User");
const { GroupSerializer, GroupMembershipSerializer, GroupCreateSerializer } = require("./group_serializers");

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ detail: "Authentication credentials were not provided." });
    }
};

const groupController = {
    // List all groups
    listGroups: async (req, res) => {
        try {
            let whereClause = { is_active: true };
            
            if (req.query.category) {
                whereClause.category = req.query.category;
            }
            
            if (req.query.privacy) {
                whereClause.privacy = req.query.privacy;
            } else {
                // Only show public groups to non-authenticated users
                if (!req.user) {
                    whereClause.privacy = 'public';
                }
            }

            const groups = await Group.findAll({
                where: whereClause,
                order: [['member_count', 'DESC'], ['created_at', 'DESC']]
            });

            const groupsWithMembership = await Promise.all(groups.map(async (group) => {
                let membership = null;
                if (req.user) {
                    membership = await GroupMembership.findOne({
                        where: { user_id: req.user.id, group_id: group.id }
                    });
                }
                return GroupSerializer.toRepresentation(group, req.user, membership);
            }));

            res.status(200).json(groupsWithMembership);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    // Get specific group
    getGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (!group) {
                return res.status(404).json({ detail: "Group not found." });
            }

            let membership = null;
            if (req.user) {
                membership = await GroupMembership.findOne({
                    where: { user_id: req.user.id, group_id: group.id }
                });
            }

            res.status(200).json(GroupSerializer.toRepresentation(group, req.user, membership));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    // Create new group
    createGroup: async (req, res) => {
        try {
            const validatedData = GroupCreateSerializer.validateAndPrepare(req.body, req.user);
            
            const newGroup = await Group.create(validatedData);
            
            // Add creator as admin member
            await GroupMembership.create({
                user_id: req.user.id,
                group_id: newGroup.id,
                role: 'creator',
                status: 'active'
            });

            res.status(201).json(GroupSerializer.toRepresentation(newGroup, req.user, { role: 'creator', status: 'active' }));
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    },

    // Join group
    joinGroup: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (!group) {
                return res.status(404).json({ detail: "Group not found." });
            }

            const existingMembership = await GroupMembership.findOne({
                where: { user_id: req.user.id, group_id: group.id }
            });

            if (existingMembership) {
                return res.status(400).json({ detail: "You are already a member of this group." });
            }

            const status = group.privacy === 'invite_only' ? 'pending' : 'active';
            
            const membership = await GroupMembership.create({
                user_id: req.user.id,
                group_id: group.id,
                role: 'member',
                status: status
            });

            if (status === 'active') {
                await group.increment('member_count');
            }

            res.status(201).json({ 
                detail: status === 'pending' ? "Join request sent." : "Successfully joined group.",
                membership: GroupMembershipSerializer.toRepresentation(membership)
            });
        } catch (error) {
            res.status(400).json({ detail: error.message });
        }
    },

    // Leave group
    leaveGroup: async (req, res) => {
        try {
            const membership = await GroupMembership.findOne({
                where: { user_id: req.user.id, group_id: req.params.id }
            });

            if (!membership) {
                return res.status(404).json({ detail: "You are not a member of this group." });
            }

            if (membership.role === 'creator') {
                return res.status(400).json({ detail: "Group creator cannot leave. Transfer ownership or delete the group." });
            }

            await membership.destroy();
            
            const group = await Group.findByPk(req.params.id);
            if (group && membership.status === 'active') {
                await group.decrement('member_count');
            }

            res.status(200).json({ detail: "Successfully left the group." });
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    // Get group members
    getGroupMembers: async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.id);
            if (!group) {
                return res.status(404).json({ detail: "Group not found." });
            }

            const memberships = await GroupMembership.findAll({
                where: { group_id: req.params.id, status: 'active' },
                include: [{
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'first_name', 'last_name', 'role', 'profile_picture']
                }],
                order: [['role', 'ASC'], ['joined_at', 'ASC']]
            });

            res.status(200).json(memberships.map(GroupMembershipSerializer.toRepresentation));
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    },

    // Get user's groups
    getUserGroups: async (req, res) => {
        try {
            const memberships = await GroupMembership.findAll({
                where: { user_id: req.user.id, status: 'active' },
                include: [{
                    model: Group,
                    as: 'group',
                    where: { is_active: true }
                }],
                order: [['joined_at', 'DESC']]
            });

            const groups = memberships.map(membership => 
                GroupSerializer.toRepresentation(membership.group, req.user, membership)
            );

            res.status(200).json(groups);
        } catch (error) {
            res.status(500).json({ detail: error.message });
        }
    }
};

module.exports = { groupController, isAuthenticated };
