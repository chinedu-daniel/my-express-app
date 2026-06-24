function validateRegister(req, res, next) {
    if(!req.body.name) {
        return res.status(400).json({
            message: "Name is required"
        });
    }

    if(!req.body.email) {
        return res.status(400).json({
            meesage: "Email is required"
        });
    }

    if(!req.body.password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }

    if(req.body.password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6"
        });
    }

    next();
}

module.exports = {
    validateRegister
}