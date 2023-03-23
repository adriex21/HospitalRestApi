const Employee = require('../models/Employee');
const Patient = require('../models/Patients');
const Treatment = require('../models/Treatments')
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

                        newPatient.save().then(patient=>{
                            res.send({msg:'Patient was created'});
                        }).catch(err=>console.log(err))

                        doctor.patients.push(newPatient._id);
                        doctor.save();
    
                    }
                })

                
            }
        },

        updatePatient : async(req, res) => {

            const drOrManager = await Employee.findById(req.employee._id);
            const doctor = await Patient.findOne({doctor: req.employee._id}); //search for the patient whose doctor is the one making the request
            const patient = await Patient.findById(req.params.id) //search for the patient we making the request for

            if (!['General Manager', 'Doctor'].includes(drOrManager?.role) && !doctor._id.equals(patient._id)) {
                return res.status(200).send({msg : "You are not a general manager or patient's doctor"});
            }

            // if(!doctor._id.equals(patient._id)) {
            //     return res.status(200).send({msg:"You are not the patient's doctor"});  //we verify if the doctor making the request is the same doctor that manages the patient
            // }


            try {
                const patientId = req.params.id;
                const updatedPatientData = req.body;
                
                const patient = await Patient.findOneAndUpdate(
                  {_id: patientId}, 
                  updatedPatientData,
                  { new: true } // This option returns the updated patient instead of the old one
                );
                
                
                if (!patient) {
                  return res.status(404).json({ message: 'Patient not found.' });
                }
                else {
                  return res.status(200).json({ message: 'Patient updated' });
                }
            
              
              } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error.' });
        }

        },

        assignAssistant: async(req,res) => {

            const drOrManager = await Employee.findById(req.employee._id);
            const patient = await Patient.findById(req.params.id) 

            if (!['General Manager', 'Doctor'].includes(drOrManager?.role) && !patient.doctor.equals(req.employee._id)) {
                return res.status(200).send({msg : "You are not a general manager or patient's doctor"});
            }

            // if(!patient.doctor.equals(req.employee._id)) {
            //     return res.status(200).send({msg:"You are not the patient's doctor"});  
            // }

            


            try {
                const patientId = req.params.id;          
                const assistant = await Employee.findById(req.body.assistants);
                const patient = await Patient.findById(patientId);

                if(!assistant){
                    return res.status(404).json({ message: 'Assistant not found.' });
                }
                if(patient.assistants.includes(req.body.assistants)) {
                    return res.status(404).json({ message: 'Assistant already assigned' });
                }
                
                patient.assistants.push(req.body.assistants);
                patient.save();
                assistant.patients.push(patient._id);
                assistant.save();


                if (!patient) {
                  return res.status(404).json({ message: 'Patient not found.' });
                }
                else {
                  return res.status(200).json({ message: 'Assistant assigned' });
                }

              
              } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error.' });
        }


        },

        createTreatment: async (req, res) => {

            const {name,description,medication} = req.body;
            const drOrManager = await Employee.findById(req.employee._id);

            let errors  = [];

            if(!name|| !description || !medication) {
                errors.push({msg: "Please fill all the fields"});
            }

            if(!['Doctor', 'General Manager'].includes(drOrManager?.role)) {
                errors.push({msg : 'You are not a general manager or a doctor'});
            }

            if(errors.length > 0) {
                res.send(errors)
            } else {
                        const newTreatment = new Treatment({
                            name,
                            description,
                            medication

                        });

                        newTreatment.save().then(treatment=>{
                            res.send({msg:'Treatment was created'});
                        }).catch(err=>console.log(err))

                    }
                  
            },



        editTreatment: async(req,res) => {

            
            const drOrManager = await Employee.findById(req.employee._id);

            if(!['Doctor', 'General Manager'].includes(drOrManager?.role)) {
                res.status(200).send({msg : 'You are not a general manager or a doctor'});
            }

            try {
                    const updatedTreatmentData = req.body;
                    const treatmentId = req.params.id;
                    
                        const treatment = await Treatment.findOneAndUpdate(
                            {_id : treatmentId },
                            updatedTreatmentData,
                            {new: true}
                            );

                            if(!treatment) {
                                res.status(404).send({msg: "Treatment doesn't exist"})
                            }

                            else {
                                res.status(200).send({msg: "Treatment updated"})
                            }

                    } catch(err) {
                        console.log(err);
                        res.status(500).send({msg: "Interval server error"})
                    }
                  


        },

        recommendTreatment: async(req,res) => {
            const doctor = await Employee.findById(req.employee._id);
            const patient = await Patient.findById(req.params.id) 

            if (!['Doctor'].includes(doctor?.role) && !patient.doctor.equals(req.employee._id)) {
                return res.status(200).send({msg : "You are not the patient's doctor"});
            }

            try {
                const patientId = req.params.id;          
                const treatmentId = await Treatment.findById(req.body.treatmentsRecommended);
                const patient = await Patient.findById(patientId);

                console.log()

                if(!treatmentId){
                    return res.status(404).json({ message: 'Treatment not found.' });
                }
                if(patient.treatmentsRecommended.some(obj => obj.id === req.body.treatmentsRecommended)) {
                    return res.status(404).json({ message: 'Treatment already assigned' });
                }
                
                const treatment = {id: req.body.treatmentsRecommended, applied:false, appliedBy:'None', recommendedBy : req.employee._id};
                patient.treatmentsRecommended.push(treatment);
                patient.save();
            

                if (!patient) {
                  return res.status(404).json({ message: 'Patient not found.' });
                }
                else {
                  return res.status(200).json({ message: 'Treatment assigned' });
                }

              
              } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error.' });
        }
            
        },
        
        applyTreatment: async(req,res) => {

            const asssistant = await Employee.findById(req.employee._id);
            const patient = await Patient.findById(req.params.id)


            if (!['Assistant'].includes(asssistant?.role)) {
                return res.status(200).send({msg : "You are not an assistant"});
            }

            if(!patient.assistants.includes(req.employee._id)) {
                return res.status(200).send({msg:"You are not the patient's assistant"});  
            }


            try {
                const patientId = req.params.id;          
                const treatment = await Treatment.findById(req.body.treatmentsRecommended);
                const patient = await Patient.findById(patientId);

                if(!treatment){
                    return res.status(404).json({ message: 'Treatment not found.' });
                }

                if(patient.treatmentsRecommended.some(obj => obj.id === req.body.treatmentsRecommended)) {
                    const patient = await Patient.findOneAndUpdate(
                        {_id: patientId, "treatmentsRecommended.id" : req.body.treatmentsRecommended },
                        {$set : {"treatmentsRecommended.$[elem].applied" : true, "treatmentsRecommended.$[elem].applied":true,
                         "treatmentsRecommended.$[elem].appliedBy" :req.employee._id, "treatmentsRecommended.$[elem].dateApplied":new Date() }},
                         {arrayFilters: [{"elem.id": req.body.treatmentsRecommended}], new: true}
                        );

                    
                } else {
                    return res.status(404).json({ message: 'Treatment not found.' });
                }
                

                if (!patient) {
                  return res.status(404).json({ message: 'Patient not found.' });
                }
                else {
                  return res.status(200).json({ message: 'Treatment applied' });
                }

              
              } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error.' });
        }

        },


        getDoctorsReport: async(req,res) => {

            const manager = await Employee.findById(req.employee._id);

            if (!['General Manager'].includes(manager?.role)) {
                return res.status(200).send({msg : "You are not a general manager"});
            }

            try {
                const doctors = await Employee.find({role: "Doctor"}).populate({path: 'patients', select: 'name gender adress phone'}).select('name email specialty patients');

                const patientCountByDoctor = await Employee.aggregate([
                    { $match: { role: 'Doctor' } },
                    { $lookup: { from: 'patients', localField: 'patients', foreignField: '_id', as: 'patients' } },
                    { $lookup: { from: "employees", localField: "_id", foreignField: "_id",as: "doctor"}},
                    { $project: { _id: "$_id",  name: { $arrayElemAt: ["$doctor.name", 0] }, patientCount: { $size: '$patients' }} },
                    { $group: { _id: '$_id', name: { $first: "$name" }, patientCount: { $sum: '$patientCount' }} }
                  ]);

    
                const stats = {patientCountByDoctor};  
                const report = {
                  doctors,
                  stats,
                };
                res.json(report);
              } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error.' });
              }
        },

        getTreatmentsReport : async(req,res) => {

            const drOrManager = await Employee.findById(req.employee._id);

            if (!['General Manager', 'Doctor'].includes(drOrManager?.role)) {
                return res.status(200).send({msg : "You are not a general manager or a doctor"});
            }

            try {

                const patientId = req.params.id;
                const patient = await Patient.findById(patientId);

                const appliedTreatments = patient.treatmentsRecommended.filter(treatment => treatment.applied === true);

                res.json(appliedTreatments);

            } catch(err) {
                console.error(err);
                res.status(500).json({ message: 'Server error.' });
            }


        },

        getDoctor: async (req,res) => {

            const doctor = await Employee.findById(req.params.id);
            const manager = await Employee.findById(req.employee._id);

            if(manager.role !== 'General Manager') {
                res.status(404).send({msg: "You are not a general manager"});
            }

              try{

                if(!doctor) {
                    res.status(404).send({msg: "Doctor doesn't exist"});
                }

                if(doctor.role !== 'Doctor') {
                    res.status(404).send({msg: "Not a doctor"});
                } 
                else{
                    return res.status(200).send(doctor)
                }



              } catch(err) {
                 res.status(500).send({msg: "Interal error"})
              }
            
        },

        deleteDoctor: async (req,res) => {

            const doctor = await Employee.findById(req.params.id);
            const manager = await Employee.findById(req.employee._id);
            
            if(manager.role !== 'General Manager') {
                res.status(404).send({msg: "You are not a general manager"});
            }

            if(!doctor || doctor.role !== 'Doctor') {
                res.status(404).send({msg: "Doctor doesn't exist"});
            }

            try {

                if(doctor) {
                    await Employee.findOneAndDelete({_id: req.params.id});
                    res.status(200).send({msg: "Doctor deleted"})
                }
                  
                  if (!patient) {
                    return res.status(404).json({ message: 'Patient not found.' });
                  }

            } catch (err) {
                console.log(err);
                res.status(500).json({msg: "Internal error"})
            }


        },

        getPatient: async(req,res) => {
            const patient = await Patient.findById(req.params.id);
            const manager = await Employee.findById(req.employee._id);

            if(manager.role !== 'General Manager') {
                res.status(404).send({msg: "You are not a general manager"});
            }

              try{

                if(!patient) {
                    res.status(404).send({msg: "Patient doesn't exist"});
                }

                else{
                    return res.status(200).send(patient)
                }

              } catch(err) {
                 res.status(500).send({msg: "Interal error"})
              }
            
        },

        deletePatient: async(req,res) => {

            const patient = await Patient.findById(req.params.id);
            const drOrManager = await Employee.findById(req.employee._id);
            
            if (!['General Manager', 'Doctor'].includes(drOrManager?.role)) {
                return res.status(200).send({msg : "You are not a general manager or a doctor"});
            }

            try {

                if(patient) {
                    await Patient.findOneAndDelete({_id: req.params.id});
                    const employee = await Employee.find({patients:{$all: [req.params.id]}});

                      employee.forEach(async (employee) => {
                        const index = employee.patients.indexOf(req.params.id);
                        employee.patients.splice(index, 1);
                        await employee.save();
                      });

                      res.status(200).send({msg: "Patient deleted"});
                }
                else {
                    return res.status(404).json({ message: 'Patient not found.' });
                  }


            } catch (err) {
                console.log(err);
                res.status(500).json({msg: "Internal error"})
            }

        }


    }
    
    


module.exports = controller;