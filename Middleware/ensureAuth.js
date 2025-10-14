// backend/middleware/ensureAuth.js
module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // user is logged in, continue
    } else {
      return res.redirect("/login"); // not logged in → go to login page
    }
  },
};
