const express = require("express");
const User = require("../models/Users");
const { isLoggedIn } = require("../middlewares/userAuth");

const router = express.Router();
// const { isLoggedIn } = require("../middlewares/auth");

// import user controller
const userController = require("../controllers/userController");

// handle signup logic
router.post("/register", userController.signup);

// route for email confirmation
router.get("/verify-email", userController.verifyEmail);

// handles login logic
router.post("/login", userController.login);

// Logout Handler
router.get("/logout", userController.logout);

// user profile route
router.get("/user", isLoggedIn, (req, res) => {
    const { user } = req;
    res.render("user", { layout: false, user });
});

// update user details route
router.get("/userProfile", isLoggedIn, (req, res) => {
    const { user } = req;
    res.render("updateProfile", { layout: false, user });
});

// update user details
router.post("/updateProfile", isLoggedIn, userController.updateProfile);

// update user password
router.post("/updatePassword", isLoggedIn, userController.updatePassword);

module.exports = router;
