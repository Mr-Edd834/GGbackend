const express = require("express");
const { ensureAuth } = require("../Middleware/ensureAuth");
const router = express.Router();

// Protect these routes
router.get("/checkout", ensureAuth, (req, res) => {
  res.send("🛒 Checkout Page - Authenticated user only");
});

router.get("/myorder", ensureAuth, (req, res) => {
  res.send("📦 My Order Page - Authenticated user only");
});

router.get("/orderhistory", ensureAuth, (req, res) => {
  res.send("🧾 Order History - Authenticated user only");
});

router.get("/profile", ensureAuth, (req, res) => {
  res.json({
    message: "👤 Profile Page",
    user: req.user, // send logged in user data to frontend
  });
});

module.exports = router;
