// routes/auth.js
const express = require("express");
const passport = require("passport");

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || "https://mockgg3.vercel.app";

// Start Google OAuth
router.get(
  "/google",
  (req, _res, next) => {
    console.log("🔁 /auth/google hit", {
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
      clientIdPresent: Boolean(process.env.GOOGLE_AUTH_CLIENT_ID),
    });
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback -> redirect to frontend
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/login?auth=failed`,
    session: true,
  }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/auth/success`);
  }
);

// Current session user
router.get("/me", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ authenticated: true, user: req.user });
  }
  return res.status(401).json({ authenticated: false });
});

// Logout and redirect to frontend
router.get("/logout", (req, res) => {
  req.logout(() => {
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect(`${FRONTEND_URL}/`);
      });
    } else {
      res.clearCookie("connect.sid");
      res.redirect(`${FRONTEND_URL}/`);
    }
  });
});

module.exports = router; // 🔥 this line is crucial
