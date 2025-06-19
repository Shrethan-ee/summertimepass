const User = require("../models/User");

class CustomTokenObtainPairSerializer {
    static getTokenPayload(user) {
        return {
            user_id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
    }
}

class UserSerializer {
    static toRepresentation(user) {
        if (!user) return null;
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            bio: user.bio,
            profile_picture: user.profile_picture,
            company_name: user.company_name,
            investment_focus: user.investment_focus,
        };
    }
}

class UserRegistrationSerializer {
    static async validate(data, validatePassword, findUserByUsernameOrEmail) {
        const errors = {};

        if (!data.username || data.username.trim() === "") {
            errors.username = "Username is required.";
        }
        if (!data.email || data.email.trim() === "") {
            errors.email = "Email is required.";
        }
        if (!data.password) {
            errors.password = "Password is required.";
        }
        if (!data.password2) {
            errors.password2 = "Password confirmation is required.";
        }

        if (data.password !== data.password2) {
            errors.password2 = "Password fields didn\'t match.";
        }

        try {
            validatePassword(data.password);
        } catch (e) {
            errors.password = e.message;
        }

        const existingUser = await findUserByUsernameOrEmail(data.username, data.email);
        if (existingUser) {
            if (existingUser.username === data.username) {
                errors.username = "A user with that username already exists.";
            }
            if (existingUser.email === data.email) {
                errors.email = "A user with that email already exists.";
            }
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        const { password2, ...validatedData } = data;
        return validatedData;
    }

    static async create(validatedData, hashPassword, createUserInDB) {
        const hashedPassword = await hashPassword(validatedData.password);
        const newUser = {
            ...validatedData,
            password: hashedPassword,
        };
        const createdUser = await createUserInDB(newUser);
        return createdUser;
    }
}

class UserUpdateSerializer {
    static validateAndUpdate(instance, data) {
        const errors = {};

        if (data.email && !/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
            errors.email = "Invalid email format.";
        }

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors));
        }

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if ([
                    'first_name', 'last_name', 'bio', 'profile_picture',
                    'company_name', 'investment_focus', 'email'
                ].includes(key)) {
                    instance[key] = data[key];
                }
            }
        }
        return instance;
    }
}

module.exports = {
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserRegistrationSerializer,
    UserUpdateSerializer
};


