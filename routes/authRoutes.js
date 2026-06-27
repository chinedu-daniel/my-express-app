const express = require("express");
const router = express.Router();

const registerUser = require("../controllers/authController");
const validate = require("../middleware/validate");
const registerSchema = require("../validators/register.schema");
const errorHandler = require("../middleware/error.middleware");

router.post(
    "/register",
    validate(registerSchema),
    registerUser
);

app.use(errorHandler);

module.exports = router;