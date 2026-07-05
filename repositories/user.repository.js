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
    `INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
    [email, name, password]
  );

  return result.rows[0];
};
