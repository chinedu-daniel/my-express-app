function validate(schema) {
    return function(req, res, next) {

        const errors = [];

        const body = req.body;

        for (const field in schema) {
            const rules = schema[field];

            if(rules.required && !body[field]) {
                errors.push(
                    `${field} is required`
                );
            }

            if (rules.minLength && body[field].length < rules.minLength) {
                errors.push(
                    `${field} must be at least ${rules.minLength} characters`
                );
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    errors
                });
            }
        }

        next();
    };
}

module.exports = {
    validate
}