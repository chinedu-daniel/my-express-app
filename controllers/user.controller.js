const getAllUsers = require("../services/user.services");

async function registerUser(req, res) {
    console.log("Controller starts here");

    const user = await get.register(req.body);

    console.log("Controller Ends here");

    res.status(201).json(user);
}

module.exports = registerUser;