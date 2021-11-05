const nodemailer = require("nodemailer");
const africastalking = require("africastalking")({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});
const generateOtp = require("../../utils/code_random");

const {
 MAIL_USER, MAIL_PASSWORD, MAIL_SERVICE,
} = process.env;

const transporter = nodemailer.createTransport({
  service: MAIL_SERVICE,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});

exports.sendSmsPasswordResetToken = async (user) => {
  const resetUser = user;
  let isSent;
  try {
    const sms = africastalking.SMS;
    const codeLength = 6;
    const resetToken = generateOtp(codeLength, false);
    const today = new Date().getDate();
    // Generate and set password reset token
    resetUser.reset_password_token = resetToken;
    // expires in one day
    resetUser.reset_password_expires = today;
    resetUser.save();
    const options = {
      to: [`+${user.phoneNumber}`],
      message: `Your password reset token for Trove test is ${resetUser.reset_password_token}`,
    };
    isSent = await sms.send(options);
    return isSent;
  } catch (error) {
    isSent = false;
    return isSent;
  }
};

exports.sendEmailPasswordResetToken = async (user) => {
  const resetUser = user;
  let isSent;
  try {
    const codeLength = 6;
    const resetToken = generateOtp(codeLength, false);
    const today = new Date().getDate();
    // Generate and set password reset token
    resetUser.reset_password_token = resetToken;
    // expires in one day
    resetUser.reset_password_expires = today;
    resetUser.save();
    const mailOptions = {
      from: `CustomerPayMe <${MAIL_USER}>`,
      to: user.email,
      subject: "Your password reset token",
      html: `
    <div>
      <img src="https://customerpay.me/frontend/assets/img/favicon.png" style="display: block;margin: 10px auto" />
      <strong>Hi</strong>
      <p>Your password reset token for Trove is <strong style="font-size:1.15em;">${resetUser.reset_password_token}</strong></p>
    </div>
    `,
    };
    isSent = await transporter.sendMail(mailOptions);
    return isSent;
  } catch (error) {
    isSent = false;
    return isSent;
  }
};
