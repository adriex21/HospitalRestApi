const express = require('express');
const router = express.Router();
const doctor = require('../controllers/doctor')
const auth = require('../middlewares/auth')


router.post('/createPatient' , auth(), doctor.createPatient);
router.put('/updatePatient/:id', auth(), doctor.updatePatient);
router.put('/assignAssistant/:id', auth(), doctor.assignAssistant);
router.post('/createTreatment', auth(), doctor.createTreatment);
router.put('/editTreatment/:id', auth(), doctor.editTreatment);
router.put('/recommendTreatment/:id', auth(), doctor.recommendTreatment);
router.get('/getPatient/:id' , auth(), doctor.getPatient);
router.delete('/deletePatient/:id' , auth(), doctor.deletePatient);
router.get('/getTreatment/:id',auth(), doctor.getTreatment);
router.delete('/deleteTreatment/:id', auth(), doctor.deleteTreatment);
router.get('/getTreatmentsReport/:id', auth(), doctor.getTreatmentsReport);   

module.exports= router;
