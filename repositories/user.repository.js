const users = require("../data/users");

function findByEmail(email) {

    console.log("===== REPOSITORY: findByEmail =====");
    console.log("Email received:", email);

    const foundUser = users.find(user => user.email === email);

    console.log("Found user:", foundUser);

    return foundUser;
}

function create(userData) {

    console.log("===== REPOSITORY: create =====");
    console.log("User received:", userData);

    users.push(userData);

    console.log("Database after insert:", users);
    
    return userData;
}

module.exports = {
    findByEmail,
    create
};