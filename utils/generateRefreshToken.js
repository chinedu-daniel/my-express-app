const jwt = require("jsonwebtoken");

function generateRefreshToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        "my_refresh_secret_key",
        {
            expiresIn: "7d"
        }
    );
}

module.exports = generateRefreshToken;