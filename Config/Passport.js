// config/passport.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../Models/User");

module.exports = (passport) => {
  // Safe debug: log presence (not values) of required envs and callback URL
  const hasClientId = Boolean(process.env.GOOGLE_AUTH_CLIENT_ID);
  const hasClientSecret = Boolean(process.env.GOOGLE_AUTH_CLIENT_SECRET);
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
  console.log(
    `🔎 Google OAuth envs -> CLIENT_ID: ${hasClientId}, CLIENT_SECRET: ${hasClientSecret}, CALLBACK_URL: ${callbackUrl}`
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) return done(null, existingUser);

          // Create new user if not found
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
          });

          const savedUser = await newUser.save();
          done(null, savedUser);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  // Store user info in session
  passport.serializeUser((user, done) => done(null, user.id));

  // Retrieve user info from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
