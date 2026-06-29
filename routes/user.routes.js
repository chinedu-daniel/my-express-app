const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

console.log("BODY:", req.body);
// const validate = require("../middleware/validate");
// const registerSchema = require("../validators/register.schema");
// const errorHandler = require("../middleware/error.middleware");

router.post(
    "/users",
    // validate(registerSchema),
    userController.createUser
);

// router.use(errorHandler);

module.exports = router;