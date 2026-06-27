const userRepository = require("../repositories/user.repository");

async function register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const user = await userRepository.create(userData);

    return user;
}

module.exports = {
    register
};