const userService = require("../services/user.services");

exports.createUser = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);

  const user = await userService.createUser(req.body);

  res.status(201).json({
    message: "User created successfully",
    data: user,
  });
});