const express = require("express");
// import user controller
const loanController = require("../controllers/loanController");

const router = express.Router();
const { isLoggedIn } = require("../middlewares/userAuth");

// user loan viablity route
router.get("/takeLoans", isLoggedIn, loanController.createloan);

// User active loan and balance enquiry route
router.post("/balance", isLoggedIn, loanController.checkBalance);

module.exports = router;
