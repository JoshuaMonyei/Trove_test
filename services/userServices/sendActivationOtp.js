const nodemailer = require("nodemailer");
const africastalking = require("africastalking")({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});
const Otp = require("../../models/otp");
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

exports.sendSmsOtp = async (userId, phoneNumber) => {
  let isSent;
  try {
    const sms = africastalking.SMS;
    const codeLength = 6;
    // check if an otp exists and update the code
    let otp = await Otp.findOne({
      userId,
      otp_type: "sms",
    });
    if (otp) {
      otp.otp_code = generateOtp(codeLength, false);
    } else {
      otp = new Otp({
        otp_code: generateOtp(codeLength, false),
        otp_type: "sms",
        userId,
      });
    }
    const options = {
      to: [`+${phoneNumber}`],
      message: `Your number verification to Trove is ${otp.otp_code}`,
    };
    isSent = await sms.send(options);
    await otp.save();
    return isSent;
  } catch (error) {
    isSent = false;
    return isSent;
  }
};

exports.sendEmailOtp = async (userId, email) => {
  let isSent;
  try {
    const codeLength = 6;
    // check if an otp exists and update the code
    let otp = await Otp.findOne({
      userId,
      otp_type: "email",
    });
    if (otp) {
      otp.otp_code = generateOtp(codeLength, false);
    } else {
      otp = new Otp({
        otp_code: generateOtp(codeLength, false),
        otp_type: "email",
        userId,
      });
    }
    const mailOptions = {
      from: `CustomerPayMe <${MAIL_USER}>`,
      to: email,
      subject: "Verify your email address",
      html: `
    <div>
      <img src="https://customerpay.me/frontend/assets/img/favicon.png" style="display: block;margin: 10px auto" />
      <strong>Hi</strong>
      <p>Welcome to Trove. To begin please verify your email address</p><br>
      <p>Your account verification token is <strong style="font-size:1.15em;">${otp.otp_code}</strong></p>
    </div>
    `,
    };
    isSent = await transporter.sendMail(mailOptions);
    await otp.save();
    return isSent;
  } catch (error) {
    isSent = false;
    return isSent;
  }
};
