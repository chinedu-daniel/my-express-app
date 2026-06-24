const registerSchema = {
    username: {
        required: true
    },

    email: {
        required: true
    },

    password: {
        required: true,
        minLength: 6
    }
};

module.exports = {
    registerSchema
}