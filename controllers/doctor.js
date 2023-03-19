const Doctor = require('../models/Doctors');
const jwt = require('jsonwebtoken')
const passport = require('passport');


const generateToken = (doctorId, expires, secret = 'secret')