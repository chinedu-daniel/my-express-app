const express = require("express");
const router = express.Router();

const { validate } = require("../middleware/validate");
const registerUser = require("../controllers/authController");

router.post("/register",
    validate["username", "email", "password"],
    registerUser
);

module.exports = router;