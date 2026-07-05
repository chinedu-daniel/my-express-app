const userService = require("../services/user.services");
const asyncHandler = require("../utils/asyncHandler");

exports.signup = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);

  const user = await userService.signup(req.body);

  res.status(201).json({
    message: "User created successfully",
    data: user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);

  const  user = await userService.login(req.body);

  res.status(200).json({
    message: "User logged in successfully",
    data: user
  });
});