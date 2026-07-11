const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema, updateUserSchema, 
    forgotPasswordSchema, resetPasswordSchema, 
    verifyEmailSchema, resendVerificationSchema, 
    googleLoginSchema} = require("../validators/user.schema");
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const { sendEmail } = require("../utils/email");

// const errorHandler = require("../middleware/error.middleware");

router.post(
    "/users/signup",
    validate(signupSchema),
    userController.signup
);

 router.post(
    "/users/login",
    validate(loginSchema),
    userController.login
);

router.post(
    "/users/refresh-token", 
    userController.refreshToken
);

router.get(
    "/users/profile", 
    protect,
    userController.getProfile
);

router.post(
    "/users/logout",
    protect, 
    userController.logout
);

router.get(
    "/users/admin-only",
    protect,
    authorize("admin"),
    userController.adminOnly
);

router.patch(
    "/users/:id", 
    protect, 
    validate(updateUserSchema),
    userController.updateUser
);

router.post(
    "/users/forgot-password", 
    validate(forgotPasswordSchema),
    userController.forgotPassword
);

router.post(
    "/users/reset-password",
    validate(resetPasswordSchema),
    userController.resetPassword
);

router.post(
    "/users/verify-email", 
    validate(verifyEmailSchema), 
    userController.verifyEmail
);

router.post(
    "/users/resend-verification", 
    validate(resendVerificationSchema), 
    userController.resendVerification
);

router.post(
    "/users/google-login", 
    validate(googleLoginSchema), 
    userController.googleLogin
);


// const { sendEmail } = require("../utils/email");

router.get("/test-email", async (req, res, next) => {
    try {
        await sendEmail({
            to: "test@example.com",
            subject: "Mailtrap Test",
            text: "Congratulations! Your backend sent its first email.",
            html: `
                <h2>Backend Engineering Masterclass</h2>
                <p>Congratulations!</p>
                <p>Your backend successfully sent its first email.</p>
            `
        });

        res.json({
            message: "Email sent successfully"
        });
    } catch (error) {
        next(error);
    }
});

// router.use(errorHandler);

module.exports = router;