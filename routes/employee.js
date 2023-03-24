const express = require('express');
const router = express.Router();
const employee = require('../controllers/employee')
const auth = require('../middlewares/auth')


router.post('/register', employee.register);
router.post('/login', employee.login);
router.post('/createDoctor', auth(), employee.createDoctor);
router.put('/updateEmployee/:id', auth(), employee.updateEmployee);
router.post('/createAssistant', auth(), employee.createAssistant);
router.post('/createPatient' , auth(), employee.createPatient);
router.put('/updatePatient/:id', auth(), employee.updatePatient);
router.put('/assignAssistant/:id', auth(), employee.assignAssistant);
router.post('/createTreatment', auth(), employee.createTreatment);
router.put('/editTreatment/:id', auth(), employee.editTreatment);
router.put('/recommendTreatment/:id', auth(), employee.recommendTreatment);
router.put('/applyTreatment/:id', auth(), employee.applyTreatment);
router.get('/getDoctorsReport', auth(), employee. getDoctorsReport);
router.get('/getTreatmentsReport/:id', auth(), employee.getTreatmentsReport);   
router.get('/getDoctor/:id', auth(), employee.getDoctor);
router.delete('/deleteDoctor/:id', auth(), employee.deleteDoctor);
router.get('/getPatient/:id' , auth(), employee.getPatient);
router.delete('/deletePatient/:id' , auth(), employee.deletePatient);
router.get('/getAssistant/:id', auth(), employee.getAssistant);
router.delete('/deleteAssistant/:id', auth(), employee.deleteAssistant);
router.get('/getTreatment/:id',auth(), employee.getTreatment);
router.delete('/deleteTreatment/:id', auth(), employee.deleteTreatment);


module.exports = router;