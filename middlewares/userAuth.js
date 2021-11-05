const jwt = require("jsonwebtoken");
require("dotenv").config();

const { secret } = process.env;

exports.isLoggedIn = async (req, res, next) => {
    // check if there is an authentication token
    const { token } = req.cookies;
    if (!token) {
        req.flash("error_msg", "No access, Please login");
        return res.redirect("/");
    }
    // decode token and check if valid
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) return res.status(500).json({ err });
        if (!decodedToken) {
            req.flash("error_msg", "Invalid authorization token, please login");
            return res.redirect("/");
        }
        // allow user to continue the request
        req.user = decodedToken;
        next();
    });
};
