// middleware/ensureAuth.js
module.exports = function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  // if API call: return 401, if browser route you might redirect
  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.status(401).json({ authenticated: false });
  }
  // fallback redirect to login start
  res.redirect("/auth/google");
};
