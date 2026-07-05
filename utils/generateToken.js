const jwt = require("jsonwebtoken");

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        "my_super_secret_key",
        {
            expiresIn: "1h"
        }
    );
}

module.exports = generateToken;