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

  const result = await userService.login(req.body);

  res.status(200).json({
    message: "User logged in successfully",
    data: result
  });
});

exports.getProfile = asyncHandler(async(req, res) => {
  const user = await userService.getProfile(req.user.id);

  res.status(200).json({
    message: "User profile fetched successfully",
    data: user
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    message: "User logged out successfully"
  });
});

exports.adminOnly = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    message: "Welcome Admin",
    data: {
      user: req.user
    }
  });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.updateUser(
    req.params.id,
    req.user,
    req.body
  );

  res.status(200).json({
    message: "User updated successfully",
    data: updatedUser
  });
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  const result = await userService.refreshAccessToken(refreshToken);

  res.status(200).json({
    message: "Access token refreshed successfully",
    data: result
  });
});