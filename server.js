// server.js
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

// Trust proxy (needed for Render/Heroku secure cookies)
app.set("trust proxy", 1);

// Environment vars
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "development";

// --- MIDDLEWARE SETUP ---
app.use(
  cors({
    origin: "https://mockgg3.vercel.app", // your frontend domain
    credentials: true,
  })
);
app.use(express.json());

// --- CONNECT TO MONGODB ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// --- EXPRESS SESSION SETUP ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      secure: NODE_ENV === "production", // HTTPS-only in production
      httpOnly: true,
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --- PASSPORT CONFIG ---
require("./Config/Passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES IMPORTS ---
const homeRoutes = require("./Routes/Home");
const authRoutes = require("./Routes/Auth");
const protectedRoutes = require("./Routes/Protected");

// --- ROUTES USAGE ---
app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

// --- FALLBACK ---
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found 🚫" });
});

// --- START SERVER ---
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
}
);