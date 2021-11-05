const express = require("express");

const router = express.Router();
const { isLoggedIn } = require("../middlewares/userAuth");

// root route
router.get("/", (req, res) => {
    res.render("login", { layout: false });
});

// dashboard view
router.get("/dashboard", isLoggedIn, (req, res) => {
    const { user } = req;
    res.render("dashboard", {
        layout: false,
        user,
});
});

 module.exports = router;
