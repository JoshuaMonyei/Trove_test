const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/Users");
// Google Auth
const { GOOGLE_CLIENT_ID, secret } = process.env;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const { userExists, signUpService } = require("../services/AuthServices");
const { successResponse, errorResponse } = require("../utils/responseHandlers");
const { sendSmsPasswordResetToken, sendEmailPasswordResetToken } = require("../services/userServices");

const {
 MAIL_SERVICE, MAIL_USER, MAIL_PASSWORD,
} = process.env;

require("dotenv").config();

const expiry = 84600;

// @route   POST /register
// @desc    Register user and get email verification
// @access  public route
exports.signup = async (req, res, next) => {
  try {
    // destructuring user details from req body
    const {
 name, email, password, phoneNumber,
} = req.body;
    const duplicateUser = await userExists(email, phoneNumber);
    if (duplicateUser) {
      errorResponse(res, "User already exists", 409);
      return res.redirect("/");
    }
    const emailToken = crypto.randomBytes(64).toString("hex");
    const payload = {
      name,
      email,
      password,
      emailToken,
    };

    const user = await signUpService(payload);
    // SMTP transporter for nodemailer
    const transporter = nodemailer.createTransport({
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });
    // Mail structure and contents.
    const mailOptions = {
      from: MAIL_USER,
      to: email,
      subject: "Trove assessment - verify your email",
      html: `
            <h1>Hello,</h1>
            <p>Thanks for registering on our site.</p>
            <P>Please click the link below to verify your account</p>
            <a href= "http://${req.headers.host}/verify-email?token=${emailToken}">Verify your account</a>`,
    };
    // Send confirmation mail to user after successful registration
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        errorResponse(res, "Something went wrong", 500);
      }
    });
    req.flash("success_msg", "Email verification sent to mail");
    return res.redirect("/");
  } catch (error) {
    errorResponse(res, "Something went wrong", 500);
    return next(error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ emailToken: req.query.token });
    if (!user) {
      errorResponse(res, "User not found", 404);
      return res.redirect("/");
    }
    // deleting verified user emailToken in the DB
    user.emailToken = null;
    // change user .isVerified value to true
    user.isVerified = true;
    await user.save();
    req.flash("success_msg", "Email verified successfully");
    return res.redirect("/");
  } catch (error) {
    errorResponse(res, "Failed to verify mail", 500);
    return res.redirect("/");
  }
};

// @route   POST /login
// @desc    Auth user and get token
// @access  public route
exports.login = async (req, res, next) => {
  // check for errors in email input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error_msg", "Invalid input");
    return res.redirect("/");
  }
  // else
  try {
    User.findOne({ email: req.body.email }, (err, confirmedUser) => {
      if (!confirmedUser) {
        req.flash("error_msg", "Invalid email, You're yet to be registered");
        return res.redirect("/");
      }
      // check if registered has verified emailToken
      if (!confirmedUser.isVerified) {
        req.flash("error_msg", "Please verify your email to login");
        return res.redirect("/");
      }
      // check password is correct
      const isMatch = bcrypt.compareSync(
        req.body.password,
        confirmedUser.password,
      );
      if (!isMatch) {
        req.flash("error_msg", "Email and password do not match");
        return res.redirect("/");
      }
      jwt.sign(
        {
          id: confirmedUser.id,
          name: confirmedUser.name,
        },
        secret,
        {
          expiresIn: expiry,
        },
        (error, token) => {
          res.cookie("token", token, {
            expires: new Date(Date.now() + 43200000),
            secure: false, // set to true if your using https
            httpOnly: true,
          });
          req.flash("success_msg", "Logged in successfully");
          return res.redirect("/dashboard");
        },
      );
    });
  } catch (error) {
    req.flash("error_msg", error);
    return res.redirect("/");
  }
};

exports.googleLogin = (req, res) => {
  const { token } = req.body;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload.sub;
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch((error) => {
      req.flash("error_msg", error);
      return res.redirect("/login");
    });
};

exports.logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(Date.now() + 1),
  });
  req.flash("success_msg", "Logged out");
  return res.redirect("/");
};

exports.updateProfile = async (req, res) => {
  // remove all fields in the update object with undefined as the value
  const updateObj = Object.keys(req.body).reduce((acc, key) => {
    // eslint-disable-next-line no-underscore-dangle
    const _acc = acc;
    if (req.body[key] !== "") {
      _acc[key] = req.body[key];
    }
    return _acc;
  }, {});
  const updatedUser = await User.findOneAndUpdate(
    { id: req.user.id },
    updateObj,
  );
  req.flash("success_msg", "Successfully updated user details");
  return res.redirect("/user");
};

exports.updatePassword = async (req, res) => {
  const { password1, password2 } = req.body;
  if (password1 !== password2) {
    return errorResponse(res, "Passwords do not match", 403);
  }
  // remove all fields in the update object with undefined as the value
  const updateObj = Object.keys(req.body).reduce((acc, key) => {
    // eslint-disable-next-line no-underscore-dangle
    const _acc = acc;
    if (req.body[key] !== "") {
      _acc[key] = req.body[key];
    }
    return _acc;
  }, {});
  const updatedUser = await User.findOneAndUpdate(
    { id: req.user.id },
    updateObj,
  );
  req.flash("success_msg", "Successfully updated user details");
  return res.redirect("/user");
};

exports.recoverPassword = async (req, res, next) => {
  const { email, phoneNumber } = req.body;
  try {
    const requestedUser = await userExists(email, phoneNumber);
    if (!requestedUser) {
      return errorResponse(res, "User not found", 404);
    }
    let isSent;
    // send to email if the email is provided and it matches the requested user's email
    if (email && requestedUser.email === email) {
      isSent = await sendEmailPasswordResetToken(requestedUser);
      // send to phone_number only if the phone_number is provided and it
      // matches the requested user's phone_number and no email is provided
    } else if (
      phoneNumber
      && requestedUser.phone_number === Number(phoneNumber)
      && !email
    ) {
      isSent = await sendSmsPasswordResetToken(requestedUser);
    } else {
      return errorResponse(res, "Couldn't send password reset token", 400);
    }
    if (!isSent) {
      return errorResponse(res, "Password reset token not sent", 500);
    }
    return successResponse(res, 204);
  } catch (error) {
    errorResponse(res, "Something went wrong", 500);
    return next(error);
  }
};
