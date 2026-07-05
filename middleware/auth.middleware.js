const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

function protect(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError("No token provided", 401));
    }

    if (!authHeader.startsWith("Bearer ")) {
        return next(new AppError("Invalid token format", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "my_super_secret_key");

        req.user = decoded;

        next();
    } catch (err) {
        next(new AppError("Invalid or expired token", 401));
    }
}

module.exports = protect;