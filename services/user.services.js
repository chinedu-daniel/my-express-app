const userRepository = require("../repositories/user.repository");

function register(userData) {
    const existingUser = userRepository.findByEmail(userData.email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    return userRepository.create(userData);
}

module.exports = {
    register
};