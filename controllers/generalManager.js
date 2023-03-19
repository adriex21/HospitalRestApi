const Employee = require('../models/Employee');
const {Doctor} = require('../models/Doctors');
const {GeneralManager} = require('../models/GeneralManager');
const passport = require('passport');


const controller = {
    
    createDoctor: async(req, res) => {
        const { employeeId, specialty } = req.body;
        // const manager = await GeneralManager.findById(req.employee._id);
        // if(!manager) return res.status(200).send({msg : 'You are not a general manager'});

        try {
            const employee = await Employee.findById(employeeId);
            
            if(!employee) {
                return res.status(404).send({msg: 'Employee not found'});
            }

            if (employee.role === 'Doctor') {
                return res.status(400).send({ message: 'Employee is already a doctor' });
              }

            employee.role = 'Doctor';
            employee.save();

            const doctor = new Doctor({
                employee: employee._id,
                role: 'Doctor',
                specialty
              });

              await doctor.save();

              res.send({ message: 'Doctor created successfully' });
        } catch(err) {
            console.log(err);
            res.status(500).send({ message: 'Internal server error' });
        }
    },
}

module.exports=controller;