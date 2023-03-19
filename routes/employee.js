const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee')

// const passport = require('passport')
// const auth = require('../middlewares/auth')

router.post('/register', employee.register);
router.post('/login/', employee.login);

module.exports = router;