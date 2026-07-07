const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const generateToken = require("../utils/generateToken");

exports.signup = async (data) => {
    const { name, email, password } = data;

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.createUser({
        name,
        email,
        password: hashedPassword
    });

    return newUser;
};

exports.login = async (data) => {
    const { email, password } = data;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};

exports.getProfile = async (userId) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};