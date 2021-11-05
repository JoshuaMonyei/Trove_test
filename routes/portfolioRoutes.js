const express = require("express");
// import user controller
const portfolioController = require("../controllers/portfolioController");

const router = express.Router();
const { isLoggedIn } = require("../middlewares/userAuth");

// user portfolio position
router.get("/portfolio", isLoggedIn, portfolioController.getPortfolioPosition);

// save user portfolio position
router.post("/portfolio", isLoggedIn, portfolioController.createPortfolio);

// fetch user portfolio value
router.get("/portfolioValue", isLoggedIn, portfolioController.getPortfolioValue);

module.exports = router;
