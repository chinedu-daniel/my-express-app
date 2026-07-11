const db = require("../db");

exports.deleteRefreshTokensByUserId = async (userId) => {
    const query = `
    DELETE FROM refresh_tokens
    WHERE user_id = $1
    `;

    await db.query(query, [userId]);
}