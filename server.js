

const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


// use environment variables from .env file or system environment 
const dotenv = require("dotenv");
require('dotenv').config();

// force defaults to test
const PORT = process.env.PORT ;
const HOST = process.env.HOST;

// Middleware setup
app.use(cors({ origin: "https://mockgg3.vercel.app/", credentials: true })); 
app.use(express.json());


// Body parser
app.use(express.json());
app.use(cors());



// app.get('/', (req, res) => {
//   res.send('it is working 😎');
// });


// DB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

  
// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport config
require("./Config/Passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Importing routes
const homeRoutes = require('./Routes/Home');
const authRoutes = require("./Routes/Auth");   // new auth routes
const User = require("./Models/User");
const { ensureAuth } = require("./Middleware/ensureAuth");
const protectedRoutes = require("./Routes/Protected");



// Using imported routes. Its like <meals/>
app.use("/",homeRoutes)
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://${HOST}:${PORT}`);
});







