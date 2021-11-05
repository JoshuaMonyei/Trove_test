const bcrypt = require("bcryptjs");
const UserModel = require("../../models/Users");

exports.signUpService = async (payload) => {
  const {
    name, email, emailToken,
    } = payload;
  const password = await bcrypt.hash(payload.password, 10);
  const user = await UserModel.create({
    name,
    password,
    email,
    isVerified: false,
    emailToken,
  });
  // return user;
};
