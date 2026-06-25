const express = require("express");
const router = express.Router();

const { validate } = require("../middleware/validate");
const registerUser = require("../controllers/authController");
const { registerSchema } = require("../validators/authSchema");

router.post("/register",
    validate(registerSchema),
    registerUser
);

module.exports = router;