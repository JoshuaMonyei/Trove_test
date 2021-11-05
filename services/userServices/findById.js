const User = require("../../models/Users");
// GET user from db
exports.getUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  // return user
  return user;
};
