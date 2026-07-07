const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const jwt = require("jsonwebtoken");

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

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    await userRepository.saveRefreshToken(user.id, refreshToken);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

exports.getProfile = async (userId) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

exports.updateUser = async (targetUserId, currentUser, updateData) => {
    const isOwner = currentUser.id === Number(targetUserId);
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
        throw new AppError("Forbidden: you cannot update this user", 403);
    }

    const existingUser = await userRepository.findUserById(targetUserId);

    if (!existingUser) {
        throw new AppError("User not found", 404);
    }

    const updatedUser = await userRepository.updateUserById(targetUserId, updateData);

    return updatedUser;
};

exports.refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 401);
    }

    let decoded;

    try {
        decoded = jwt.verify(refreshToken, "my_refresh_secret_key");
    } catch (error) {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const storedToken = await userRepository.findRefreshToken(refreshToken);

    if (!storedToken) {
        throw new AppError("Refresh token not recognized", 401);
    }

    const user = await userRepository.findUserById(decoded.id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const newAccessToken = generateToken(user);

    return {
        accessToken: newAccessToken
    };
};