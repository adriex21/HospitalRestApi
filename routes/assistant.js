const express = require('express');
const router = express.Router();
const assistant = require('../controllers/assistant')
const auth = require('../middlewares/auth')

router.put('/applyTreatment/:id', auth(), assistant.applyTreatment);


module.exports = router;