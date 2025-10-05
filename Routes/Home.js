// Routes/Home.js
const express = require("express");
const router = express.Router();

// GET / (home route)
router.get("/", (req, res) => {
  res.send("Welcome to the API Home Mr.Edd!");
  console.log("✅ Home routes loaded");
});
console.log("✅ Home routes loaded");

// Export router so server.js can use it
module.exports = router;
