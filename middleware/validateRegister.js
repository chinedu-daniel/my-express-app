const registerSchema = require("../validators/register.schema");

function validateRegister(req, res, next) {

    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();

}

module.exports = validateRegister;