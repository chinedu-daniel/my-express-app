const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const jwt = require("jsonwebtoken");
const hashToken = require("../utils/hashToken");
const generateResetToken = require("../utils/generateResetToken");
const crypto = require("crypto");
const refreshTokenRepository = require("../repositories/refreshToken.repository");
const { verifyGoogleToken } = require("../utils/googleAuth");
const { sendEmail } = require("../utils/email");
const { message } = require("statuses");

const pepper = process.env.PASSWORD_PEPPER || "";

function applyPepper(password) {
    return password + pepper;
}

exports.signup = async (data) => {
    const { name, email, password } = data;

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(applyPepper(password), 12);

    const newUser = await userRepository.createUser({
        name,
        email,
        password: hashedPassword
    });

    const { rawToken, hashedToken, expiresAt } = createEmailverificationToken();

    await userRepository.saveEmailVerificationToken(
        newUser.id, 
        hashedToken, 
        expiresAt
    );

    const verificationUrl = `http://localhost:3000/verify-email?token=${rawToken}`;

    await sendEmail({
        to: newUser.email,
        subject: "Verify your email",
        text: `Verify your email by visiting: ${verificationUrl}`,
        html: `
            <h2>Welcome to My Express App</h2>

            <p>Click the link below to verify your email:</p>

            <a href="${verificationUrl}">
            Verify Email
            </a>

            <p>This link expires in 10 minutes.</p>
        `
    });

    return { 
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
    };
};

exports.login = async (data) => {
    const { email, password } = data;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!user.is_verified) {
        throw new AppError("Please verify your email before logging in", 403);
    }

    const isMatch = await bcrypt.compare(applyPepper(password), user.password);

    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    const hashedRefreshToken = hashToken(refreshToken);

    await userRepository.saveRefreshToken(user.id, hashedRefreshToken);

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

exports.logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }

    const hashedRefreshToken = hashToken(refreshToken);

    await userRepository.deleteRefreshToken(hashedRefreshToken);

    return { message: "Logged out successfully" };
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

    const hashedRefreshToken = hashToken(refreshToken);

    const storedToken = await userRepository.findRefreshToken(hashedRefreshToken);

    if (!storedToken) {
        throw new AppError("Refresh token not recognized", 401);
    }

    const user = await userRepository.findUserById(decoded.id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    await userRepository.deleteRefreshToken(hashedRefreshToken);

    const newAccessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const hashedNewRefreshToken = hashToken(newRefreshToken);

    await userRepository.saveRefreshToken(user.id, hashedNewRefreshToken);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};

exports.forgotPassword = async (email) => {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        return {
            message: "If an account with that email exists, a password reset link has been sent."
        };
    }

    const { rawToken, hashedToken } = generateResetToken();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await userRepository.savePasswordResetToken(user.id, hashedToken, expiresAt);

    const resetUrl = `http://localhost:3000/reset-password?token=${rawToken}`;

    await sendEmail({
    to: user.email,
    subject: "Reset your password",
    text: `Reset your password here: ${resetUrl}`,
    html: `
        <h2>Password Reset</h2>

        <p>Click the link below to reset your password.</p>

        <a href="${resetUrl}">
            Reset Password
        </a>

        <p>This link expires in 10 minutes.</p>
    `});
    
    return {
        message: "If an account with that email exists, a password reset link has been sent."
    };
}

exports.resetPassword = async (token, newPassword) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await userRepository.findUserByPasswordResetToken(hashedToken);

    if (!user) {
        throw new AppError("Invalid or expired reset token", 400);
    }

    if (!user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
        throw new AppError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(applyPepper(newPassword), 12);

    const updateUser = await userRepository.updatePasswordAfterReset(user.id, hashedPassword);

    await refreshTokenRepository.deleteRefreshTokensByUserId(user.id);

    return updateUser;
}

function createEmailverificationToken() {
    const rawToken = crypto
        .randomBytes(32)
        .toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return {
        rawToken, 
        hashedToken, 
        expiresAt
    };
}

exports.verifyEmail = async (token) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await userRepository.findUserByEmailVerificationToken(hashedToken);

    if (!user) {
        throw new AppError("Invalid or expired verification token", 400);
    }

    const verifiedUser = await userRepository.markUserAsVerified(user.id);

    return verifiedUser;
};

exports.resendVerification = async (email) => {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.is_verified) {
        throw new AppError("Email is already verified", 400);
    }

    const { rawToken, hashedToken, expiresAt } = createEmailverificationToken();

    await userRepository.saveEmailVerificationToken(
        user.id, 
        hashedToken, 
        expiresAt
    );

    const verificationUrl = `http://localhost:3000/verify-email?token=${rawToken}`;

    await sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: `Verify here: ${verificationUrl}`,
    html: `
        <h2>Email Verification</h2>

        <a href="${verificationUrl}">
            Verify Email
        </a>

        <p>This link expires in 10 minutes.</p>
    `
    });

    return {
        message: "Verification email sent successfully"
    };
};

exports.googleLogin = async (credential) => {
    let googleUser;

    try {
        googleUser = await verifyGoogleToken(credential);
    } catch (error) {
        throw new AppError("Invalid Google credential", 401);
    }

    const { googleId, email, name, emailVerified } = googleUser;

    if (!emailVerified) {
        throw new AppError("Google account email is not verified", 400);
    }

    // returning google user
    let user = await userRepository.findUserByGoogleId(googleId);

    //if no google user exists yet, try matching by email
    if (!user) {
        const existingUser = await userRepository.findUserByEmail(email);

        if (existingUser) {
            // link google account to existing local account
            user = await userRepository.linkGoogleAccount(existingUser.id, googleId);
        } else {
            // create brand new google account
            user = await userRepository.createGoogleUser({
                id, name, email, role
            });
        }
    }

    // Generate app token (same auth system as normal login)
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    const hashedRefreshToken = hashToken(refreshToken);

    await userRepository.saveRefreshToken(user.id, hashedRefreshToken);
    // await refreshTokenRepository.createRefreshToken(user.id, hashedRefreshToken);

    return {
        user,
        accessToken,
        refreshToken
    };
};