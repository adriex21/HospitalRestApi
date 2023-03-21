const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee')
const auth = require('../middlewares/auth')

// const passport = require('passport')
// const auth = require('../middlewares/auth')

router.post('/register', employee.register);
router.post('/login', employee.login);
router.post('/createDoctor', auth(), employee.createDoctor);
router.put('/updateEmployee/:id', auth(), employee.updateEmployee);
router.post('/createAssistant', auth(), employee.createAssistant);
router.post('/createPatient' , auth(), employee.createPatient);
router.put('/updatePatient/:id', auth(), employee.updatePatient);




module.exports = router;