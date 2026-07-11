const Joi = require("joi");

const signupSchema = Joi.object ({
    name: Joi.string()
    .min(3)
    .required(),

    email: Joi.string()
    .email()
    .required(),

    password: Joi.string()
    .min(6)
    .required()
});

const loginSchema = Joi.object({
    email: Joi.string()
    .email()
    .required(),

    password: Joi.string()
    .min(6)
    .required()
});

const updateUserSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .required(),

    email: Joi.string()
    .email()
    .required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string()
    .email()
    .required()
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required()
});

const verifyEmailSchema = Joi.object({
    token: Joi.string().required()
});

const resendVerificationSchema = Joi.object({
    email: Joi.string().email().required()
});

const googleLoginSchema = Joi.object({
    credential: Joi.string().required()
});

module.exports = { 
    signupSchema, 
    loginSchema,
    updateUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    googleLoginSchema
};