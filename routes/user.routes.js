const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/user.schema");
const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

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

// router.use(errorHandler);

module.exports = router;