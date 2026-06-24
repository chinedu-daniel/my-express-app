async function registerUser(req, res) {
    res.status(201).json({
        message: "User registered"
    });
}

module.exports = registerUser;