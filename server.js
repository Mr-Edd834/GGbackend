

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

// Importing routes
const homeRoutes = require('./Routes/Home');



// Using imported routes. Its like <meals/>
app.use("/",homeRoutes)

// app.get('/', (req, res) => {
//   res.send('it is working 😎');
// });

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://${HOST}:${PORT}`);
});







