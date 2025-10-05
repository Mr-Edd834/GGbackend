// routes/auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google OAuth flow
// The "scope" specifies the info we request from Google (profile + email)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback URL Google will redirect to after login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    // Successful auth. Redirect back to frontend (you can send user to FRONTEND_URL or protected page)
    res.redirect(process.env.FRONTEND_URL || "/");
  }
);

// Simple logout
router.get("/logout", (req, res) => {
  req.logout?.();        // passport attaches this
  req.session?.destroy?.(() => {
    // redirect to frontend after logout
    res.clearCookie("connect.sid", { path: "/" });
    res.redirect(process.env.FRONTEND_URL || "/");
  });
});

// Endpoint frontend hits to check if user is authenticated
router.get("/check", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // return sanitized user info
    const { _id, displayName, email, photo } = req.user;
    return res.json({ authenticated: true, user: { _id, displayName, email, photo } });
  }
  return res.json({ authenticated: false });
});

// Optionally return session user object
router.get("/me", (req, res) => {
  if (req.user) {
    const { _id, displayName, email, photo } = req.user;
    return res.json({ user: { _id, displayName, email, photo } });
  }
  res.status(401).json({ message: "Not authenticated" });
});

module.exports = router;
