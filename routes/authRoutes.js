const express = require("express");
const router = express.Router();

const registerUser = require("../controllers/authController");
const validateRegister = require("../middleware/validateRegister");

router.post("/register",
    validateRegister,
    registerUser
);

module.exports = router;