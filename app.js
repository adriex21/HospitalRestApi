const express = require('express')
const mongoose = require('mongoose')
const cors  = require('cors');
const bodyParser= require('body-parser');
const passport = require('passport');
const router = require('./routes');
const {jwtStrategy} = require('./config/passport')

const app = express()
const port = 3002


app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

mongoose.connect('', {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error: "));
db.once("open", function () {
  console.log("API database connected successfully");
});

app.use(express.json());

app.use(cors()) 
app.options('*', cors())
app.listen(port, console.log('Server is on port: ' + port));

app.use('/api', router);

module.exports = app;
