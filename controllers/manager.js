const Employee = require('../models/Employee');
const Patient = require('../models/Patients');
const Treatment = require('../models/Treatments')
const jwt = require('jsonwebtoken')
const passport = require('passport');
const moment = require('moment')
const bcrypt = require('bcryptjs');

const controller = {

createDoctor: async(req, res) => {
    const { employeeId, specialty } = req.body;
    const manager = await Employee.findById(req.employee._id);

    if (manager.role !== 'General Manager') {
        return res.status(200).send({msg : 'You are not a general manager'});
    }

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

        const doctor = await Employee.findOneAndUpdate(
            {_id: employeeId}, 
            specialty,
            {new: true } // This option returns the updated doctor instead of the old one
          );

          await doctor.save();

          res.send({ message: 'Doctor created successfully' });
    } catch(err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
},

}

module.exports = controller;