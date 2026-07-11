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

exports.saveRefreshToken = async (userId, hashedToken) => {
  await db.query(
    `
    INSERT INTO refresh_tokens (user_id, token)
    VALUES ($1, $2)
    `,
    [userId, hashedToken]
  );
};

exports.findRefreshToken = async (hashedToken) => {
  const result = await db.query(
    `
    SELECT * FROM refresh_tokens
    WHERE token = $1
    `,
    [hashedToken]
  );

  return result.rows[0];
};

exports.deleteRefreshToken = async (hashedToken) => {
  await db.query(
    `
    DELETE FROM refresh_tokens
    WHERE token = $1
    `,
    [hashedToken]
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

exports.savePasswordResetToken = async (userId, hashedToken, expiresAt) => {
  const query = `
  UPDATE users
  SET password_reset = $1, password_reset_expires = $2
  WHERE id = $3
  RETURNING id, email, password_reset, password_reset_expires
  `;

  const values = [hashedToken, expiresAt, userId];
  const result = await db.query(query, values);

  return result.rows[0];
}

exports.findUserByPasswordResetToken = async (hashedToken) => {
  const query = `
  SELECT id, name, email, password, role, password_reset, password_reset_expires
  FROM users
  WHERE password_reset = $1
  LIMIT 1
  `;

  const values = [hashedToken];
  const result = await db.query(query, values);

  return result.rows[0];
}

exports.updatePasswordAfterReset = async (userId, hashedPassword) => {
  const query = `
  UPDATE users
  SET password = $1, password_reset = NULL, password_reset_expires = NULL
  WHERE id = $2
  RETURNING id, name, email, role
  `;

  const values = [hashedPassword, userId];
  const result = await db.query(query, values);

  return result.rows[0];
}

exports.saveEmailVerificationToken = async (userId, hashedToken, expiresAt) => {
  const query = `
  UPDATE users SET email_verification_token = $1, email_verification_expires = $2
  WHERE id = $3
  RETURNING id, email, is_verified
  `;

  const values = [hashedToken, expiresAt, userId];
  const { rows } = await db.query(query, values);
  return rows[0];
};

exports.findUserByEmailVerificationToken = async (hashedToken) => {
  const query = `
  SELECT *
  FROM users
  WHERE email_verification_token = $1 AND email_verification_expires > NOW()
  LIMIT 1
  `;

  const { rows } = await db.query(query, [hashedToken]);
  return rows[0];
};

exports.markUserAsVerified = async (userId) => {
  const query = `
  UPDATE users
  SET is_verified = TRUE, email_verification_token = NULL, email_verification_expires = NULL
  WHERE id = $1
  RETURNING id, name, email, role, is_verified
  `;

  const { rows } = await db.query(query, [userId]);
  return rows[0];
};

exports.findUserByGoogleId = async (googleId) => {
  const query = `
  SELECT * 
  FROM users
  WHERE google_id = $1
  LIMIT 1
  `;

  const { rows } = await db.query(query, [googleId]);

  return rows[0];
};

exports.createGoogleUser = async ({ name, email, googleId }) => {
  const query = `
  INSERT INTO users (name, email, google_id, auth_provider, is_verified)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, name, email, role, is_verified
  `;

  const values = [name, email, googleId, "google", true];

  const { rows } = await db.query(query, values);

  return rows[0];
};

exports.linkGoogleAccount = async (userId, googleId) => {
  const query = `
  UPDATE users
  SET google_id = $1, auth_provider = $2, is_verified = $3
  WHERE id = $4
  RETURNING id, name, email, role, is_verified, google_id, auth_provider
  `;

  const values = [googleId, "google", true, userId];

  const { rows } = await db.query(query, values);

  return rows[0];
};