const express = require("express");
const router = express.Router();

const { validateRegister } = require("../middleware/validateRegister");
const registerUser = require("../controllers/authController");

router.post("/register", validateRegister, registerUser);

module.exports = router;