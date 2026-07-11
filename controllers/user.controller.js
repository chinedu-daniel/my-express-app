const { message } = require("statuses");
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
  const { refreshToken } = req.body;

  const result = await userService.logout(refreshToken);

  res.status(200).json({
    message: result.message
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

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await userService.forgotPassword(email);

  return res.status(200).json({
    message: result.message,
    data: result.resetUrl ? { resetUrl: result.resetUrl } : null
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await userService.resetPassword(token, password);

  return res.status(200).json({
    message: "Password reset successfully",
    data: user
  });
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const user = await userService.verifyEmail(token);

  res.status(200).json({
    message: "Email verified successfully",
    data: user
  });
});

exports.resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await userService.resendVerification(email);

  res.status(200).json({
    message: "Verification email resent successfully",
    data: result
  });
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  const result = await userService.googleLogin(credential);

  res.status(200).json({
    message: "Google login successful",
    data: result
  });
});