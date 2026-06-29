const db = require("../db");

exports.createUser = async (data) => {
  const result = await db.query(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
      [data.email, data.name]
  );

  return result.rows[0];
};
