const db = require("../db");

exports.findUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
};

exports.createUser = async ({ name, email, password }) => {
  const result = await db.query(
    `INSERT INTO users
    (email, name, password) VALUES ($1, $2, $3) 
    RETURNING id, name, email, role`,
    [email, name, password]
  );

  return result.rows[0];
};

exports.findUserById = async (id) => {
  const result = await db.query(
    `SELECT id, name, email
    FROM users
    WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

exports.updateUserById = async (id, updates) => {
  const { name, email } = updates;

  const result = await db.query(
    `
    UPDATE users
    SET name = $1, email = $2
    WHERE id = $3
    RETURNING id, name, email, role
    `,
    [name, email, id]
  );

  return result.rows[0];
};

exports.saveRefreshToken = async (userId, token) => {
  await db.query(
    `
    INSERT INTO refresh_tokens (user_id, token)
    VALUES ($1, $2)
    `,
    [userId, token]
  );
};

exports.findRefreshToken = async (token) => {
  const result = await db.query(
    `
    SELECT * FROM refresh_tokens
    WHERE token = $1
    `,
    [token]
  );

  return result.rows[0];
};

exports.deleteRefreshToken = async (token) => {
  await db.query(
    `
    DELETE FROM refresh_tokens
    WHERE token = $1
    `,
    [token]
  );
};

exports.deleteRefreshTokensByUserId = async (userId) => {
  await db.query(
    `
    DELETE FROM refresh_tokens
    WHERE user_id = $1
    `,
    [userId]
  );
};