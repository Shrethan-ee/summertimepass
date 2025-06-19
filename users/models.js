// This file contains the JavaScript equivalent for the CustomUser model.
// In a Node.js environment, this would typically be implemented as a Mongoose schema
// if using MongoDB, or a Sequelize model if using a relational database.
// This class represents the structure and basic methods of the CustomUser.

class UserRole {
    static ENTREPRENEUR = 'entrepreneur';
    static INVESTOR = 'investor';
    static PUBLIC = 'public';

    static choices = [
        UserRole.ENTREPRENEUR,
        UserRole.INVESTOR,
        UserRole.PUBLIC
    ];

    static getDisplayName(role) {
        switch (role) {
            case UserRole.ENTREPRENEUR:
                return 'Entrepreneur';
            case UserRole.INVESTOR:
                return 'Investor';
            case UserRole.PUBLIC:
                return 'Public';
            default:
                return role;
        }
    }
}

class CustomUser {
    constructor({
        id,
        username,
        email,
        password,
        firstName = "",
        lastName = "",
        bio = null,
        profilePicture = null,
        role = UserRole.PUBLIC,
        companyName = null,
        investmentFocus = null,
        isStaff = false,
        isActive = true,
        isSuperuser = false,
        lastLogin = null,
        dateJoined = null
    }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password; // In a real app, this would be hashed
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.profilePicture = profilePicture;
        this.role = role;
        this.companyName = companyName;
        this.investmentFocus = investmentFocus;
        this.isStaff = isStaff;
        this.isActive = isActive;
        this.isSuperuser = isSuperuser;
        this.lastLogin = lastLogin || new Date();
        this.dateJoined = dateJoined || new Date();
        this.createdAt = this.dateJoined; // Alias for consistency with other models
        this.updatedAt = new Date();
    }

    static fromJson(json) {
        return new CustomUser({
            id: json.id,
            username: json.username,
            email: json.email,
            password: json.password, // Assuming password is not directly passed in JSON for security
            firstName: json.first_name,
            lastName: json.last_name,
            bio: json.bio,
            profilePicture: json.profile_picture,
            role: json.role,
            companyName: json.company_name,
            investmentFocus: json.investment_focus,
            isStaff: json.is_staff,
            isActive: json.is_active,
            isSuperuser: json.is_superuser,
            lastLogin: json.last_login ? new Date(json.last_login) : null,
            dateJoined: json.date_joined ? new Date(json.date_joined) : null
        });
    }

    toJson() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            bio: this.bio,
            profile_picture: this.profilePicture,
            role: this.role,
            company_name: this.companyName,
            investment_focus: this.investmentFocus,
            is_staff: this.isStaff,
            is_active: this.isActive,
            is_superuser: this.isSuperuser,
            last_login: this.lastLogin ? this.lastLogin.toISOString() : null,
            date_joined: this.dateJoined ? this.dateJoined.toISOString() : null,
            created_at: this.createdAt ? this.createdAt.toISOString() : null,
            updated_at: this.updatedAt ? this.updatedAt.toISOString() : null
        };
    }

    isEntrepreneur() {
        return this.role === UserRole.ENTREPRENEUR;
    }

    isInvestor() {
        return this.role === UserRole.INVESTOR;
    }

    isPublic() {
        return this.role === UserRole.PUBLIC;
    }

    getRoleDisplay() {
        return UserRole.getDisplayName(this.role);
    }

    toString() {
        return `${this.username} (${this.getRoleDisplay()})`;
    }
}

module.exports = { CustomUser, UserRole };


