const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validate = require("../middleware/validate");
const { signupSchema } = require("../validators/user.schema");


// console.log("BODY:", req.body);
// const registerSchema = require("../validators/register.schema");
// const errorHandler = require("../middleware/error.middleware");

router.post(
    "/users/signup",
    validate(signupSchema),
    userController.signup
);

// router.use(errorHandler);

module.exports = router;