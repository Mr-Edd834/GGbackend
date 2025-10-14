// backend/routes/home.js
const express = require("express");
const router = express.Router();

// Home route
router.get("/", (req, res) => {
  res.send("🏠 Welcome to GoGrub API Home. Please log in with Google.");
});

// Login route (this will later be handled by your frontend login page)
router.get("/login", (req, res) => {
  res.send(`
    <h1>Login Page</h1>
    <p>Please log in to continue.</p>
    <a href="/auth/google">Sign in with Google</a>
  `);
});

module.exports = router;
