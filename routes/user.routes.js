const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/user.schema");

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

// router.use(errorHandler);

module.exports = router;