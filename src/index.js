require('dotenv').config();
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const PassportConfig = require('./auth/passport')

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(passport.initialize());

// Access-Control bypass
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
  
    next();
  });


// Routes
var auth = require('./routes/auth')(app);
var profile = require('./routes/profile')(app);


// Initialize API
app.listen(port, () => console.log(`Listening on port ${port}`))

module.exports = app