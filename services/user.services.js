const userRepository = require("../repositories/user.repository");
// const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");

exports.createUser = async (data) => {
    // const hashedPassword = await bcrypt.hash(data.password, 10);

    if (!data.email) {
        throw new AppError("Email is required", 409);
    }

    return await userRepository.createUser(data
        // password: hashedPassword
    );
};