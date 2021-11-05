const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const loanRoutes = require("./routes/loanRoutes");
const routes = require("./routes/index");
require("dotenv").config();

// Initialize express
const app = express();
// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use static files
app.use(express.static("./public"));

// EJS
// app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(cookieParser());

// Express session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}));

// Connect flash
app.use(flash());

// Global Vars for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});
// utilizing routes in the routes folder
app.use(routes, userRoutes, portfolioRoutes, loanRoutes);

// Connect to the database
connectDB();

const port = process.env.PORT || 5050;

// Listen to connections
app.listen(port, () => console.log(`Server up and running on port ${port}`));
