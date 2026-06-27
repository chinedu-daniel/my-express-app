function validate(schema) {

    return function(req, res, next) {
        const { error } = schema.validate(req.body);
        
        if (error) {
            // return res.status(400).json({
            //     message: error.details[0].message
            // });

            const error = new Error("Email is required");

            return next(error);
        }
        
        next();
    };
}

module.exports = validate;