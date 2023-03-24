const express = require('express');
const router = express.Router();
const employeeRouter = require('./employee');
const managereRouter = require('./manager');
const doctorRouter = require('./doctor');
const assistantRouter = require('./assistant');


router.use("/employee", employeeRouter);
router.use("/manager", managereRouter);
router.use("/doctor", doctorRouter);
router.use("/assistant", assistantRouter);



router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/employee/login');
});
module.exports = router;