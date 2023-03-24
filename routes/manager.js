const express = require('express');
const router = express.Router();
const manager = require('../controllers/manager')
const auth = require('../middlewares/auth')

router.post('/createDoctor', auth(), manager.createDoctor);
router.put('/updateEmployee/:id', auth(), manager.updateEmployee);
router.post('/createAssistant', auth(), manager.createAssistant);
router.get('/getDoctorsReport', auth(), manager. getDoctorsReport);
router.get('/getDoctor/:id', auth(), manager.getDoctor);
router.delete('/deleteDoctor/:id', auth(), manager.deleteDoctor);
router.get('/getAssistant/:id', auth(), manager.getAssistant);
router.delete('/deleteAssistant/:id', auth(), manager.deleteAssistant);


module.exports = router;