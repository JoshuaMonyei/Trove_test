const UserModel = require("../../models/Users");

exports.userExists = async (email, phoneNumber) => {
  // check if user exists
  let user;
  if (email && !phoneNumber) {
    user = await UserModel.findOne({
      email,
    });
  } else if (phoneNumber && !email) {
    user = await UserModel.findOne({
      phoneNumber,
    });
  } else if (email && phoneNumber) {
    user = await UserModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });
  }

  return user;
};
