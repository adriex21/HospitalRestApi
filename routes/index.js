const express = require('express');
const router = express.Router();
const employeeRouter = require('./employee');


router.use("/employee", employeeRouter);



router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/employee/login');
});
module.exports = router;