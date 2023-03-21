const Employee = require('../models/Employee');
const Patient = require('../models/Patients')
const jwt = require('jsonwebtoken')
const passport = require('passport');
const moment = require('moment')
const bcrypt = require('bcryptjs');


const generateToken = (employeeId, expires, secret = 'secret') => {
    const payload = {
        sub:employeeId,
        iat:moment().unix(),
        exp:expires.unix(),
    };
    return jwt.sign(payload,secret);
};

const controller = {

    register: async(req, res) => {
        const{name,email,password,password2} = req.body;
        let errors = [];

        if(!name || !email || !password || !password2) {
            error.push({msg: 'Fill all the fields'});
        }

        if (!email.includes("@") || !email.includes(".")) {
            errors.push({ msg: 'Invalid email format' });
        }

        if (password != password2) {
            errors.push({ msg: 'Passwords not matching' });
        }

        if(errors.length > 0) {
            res.send(errors)
        } else {
            Employee.findOne({email:email}).then(employee => {
                if(employee) {
                    errors.push({msg: 'Email already used'});
                    res.send({msg:'Employee already exists'});
                } else {
                    const newEmployee = new Employee({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err,salt)=>{
                        bcrypt.hash(newEmployee.password, salt, (err,hash) => {
                            if(err) throw err;
                            newEmployee.password=hash;
                            newEmployee
                            .save()
                            .then(employee=>{
                                res.send({msg:'Employee was created'});
                            })
                            .catch(err=>console.log(err))
                        })
                    })
                }
            })
        }
    },





    login: async (req, res) => {
        try {
            let employee = await Employee.findOne({email: req.body.email } )
            let valid = await bcrypt.compare(req.body.password, employee.password);

            if (valid) {
                const expires = moment().add(10, 'days');
                const token = generateToken(employee._id, expires);
                res.send({ ok: true, id: employee._id, token:token });

                
            } else {
                res.send({ ok: false, msg: 'Password/email doesnt match' });
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    
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
    
        updateEmployee: async (req, res) => {

            const manager = await Employee.findById(req.employee._id);
            
            if (manager.role !== 'General Manager') {
                return res.status(200).send({msg : 'You are not a general manager'});
            }

            if(req.body.role) {
                return res.status(200).send({msg : 'You cannot modify the role'});
            }

            try {
                const employeeId = req.params.id;
                const updatedEmployeeData = req.body;
                
                const employee = await Employee.findOneAndUpdate(
                  {_id: employeeId}, 
                  updatedEmployeeData,
                  { new: true } // This option returns the updated doctor instead of the old one
                );
                console.log(employeeId);
                console.log(employee);
                
                if (!employee) {
                  return res.status(404).json({ message: 'Employee not found.' });
                }
                else {
                  return res.status(200).json({ message: 'Employee updated' });
                }
            
              
              } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error.' });
        }
        }, 

        createAssistant: async(req, res) => {
            const {employeeId} = req.body;
            const manager = await Employee.findById(req.employee._id);

            if (manager.role !== 'General Manager') {
                return res.status(200).send({msg : 'You are not a general manager'});
            }
    
            try {
                const employee = await Employee.findById(employeeId);
                
                if(!employee) {
                    return res.status(404).send({msg: 'Employee not found'});
                }
    
                if (employee.role === 'Assistant') {
                    return res.status(400).send({ message: 'Employee is already an assistant' });
                  }
    
                employee.role = 'Assistant';
                employee.save();
    
                const assistant = await Employee.findOneAndUpdate(
                    {_id: employeeId}, 
                    {new: true } // This option returns the updated doctor instead of the old one
                  );
    
                  await assistant.save();
    
                  res.send({ message: 'Assistant created successfully' });
            } catch(err) {
                console.log(err);
                res.status(500).send({ message: 'Internal server error' });
            }
        },


        createPatient : async(req, res) => {

            const {name,gender,birthDate,adress,phone,doctorId } = req.body;
            const drOrManager = await Employee.findById(req.employee._id);
            const doctor = await Employee.findById(doctorId);

            let errors  = [];

            if(!name|| !gender || !birthDate || !adress || !phone || !doctorId) {
                errors.push({msg: "Please fill all the fields"});
            }

            if(phone.length !== 10) {
                errors.push({msg: "Invalid phone number"});
            }

            if(doctor.role !== 'Doctor') {
                errors.push({msg: "Doctor doesn't exist"});
            }

            if(!['Doctor', 'General Manager'].includes(drOrManager?.role)) {
                errors.push({msg : 'You are not a general manager or a doctor'});
            }

            if(errors.length > 0) {
                res.send(errors)
            } else {
                Patient.findOne({phone:phone}).then(patient => {
                    if(patient) {
                        errors.push({msg: 'Phone number already used'});
                        res.send({msg:'Patient already exists'});
                    } else {
                        const newPatient = new Patient({
                            name,
                            gender,
                            birthDate,
                            adress,
                            phone,
                            doctor
                        });

                        newPatient.save().then(employee=>{
                            res.send({msg:'Patient was created'});
                        }).catch(err=>console.log(err))
    
                    }
                })
            }
        },

        updatePatient : async(req, res) => {

        },

        assignAssistant: async(req,res) => {

        },

        createTreatment: async (req, res) => {

        },

        editTreatment: async(req,res) => {

        },

        assignTreatment: async(req,res) => {

        },

        getDoctorsReport: async(req,res) => {

        },

        getTreatmentsReport : async(req,res) => {
            

        },





        
    
    
    }
    
    


module.exports = controller;