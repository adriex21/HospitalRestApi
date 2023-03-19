const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee')
const generalManager = require('../controllers/generalManager')
const passport = require('passport')
const auth = require('../middlewares/auth')

router.post('/register', employee.register);
router.post('/login/', employee.login);
router.post('/createDoctor', auth(), generalManager.createDoctor);

module.exports = router;