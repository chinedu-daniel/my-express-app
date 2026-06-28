const pool = require("../db");

async function getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
}

// function create(userData) {

//     console.log("===== REPOSITORY: create =====");
//     console.log("User received:", userData);

//     users.push(userData);

//     console.log("Database after insert:", users);
    
//     return userData;
// }

module.exports = {
    getAllUsers,
    // create
};