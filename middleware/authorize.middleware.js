const AppError = require("../utils/appError");

function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError("Unauthorized", 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError("Forbidden: you do not have permission", 403));
        }

        next();
    };
}

module.exports = authorize;