const Employee = require('../models/Employee');
const Patient = require('../models/Patients');
const Treatment = require('../models/Treatments')

const controller = {

    createPatient : async(req, res) => {

        const {name, gender, birthDate, adress, phone, doctorId } = req.body;

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
            return res.status(400).send({msg : "You are not a general manager or patient's doctor"});
        }


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
            return res.status(400).send({msg : "You are not a general manager or patient's doctor"});
        }

        try {
            const patientId = req.params.id;          
            const assistant = await Employee.findById(req.body.assistants);
            const patient = await Patient.findById(patientId);

            if(!assistant){
                return res.status(404).json({ message: 'Assistant not found.' });
            }
            if(patient.assistants.includes(req.body.assistants)) {
                return res.status(400).json({ message: 'Assistant already assigned' });
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
                return res.status(400).send({msg : "You are not the patient's doctor"});
            }

            try {
                const patientId = req.params.id;          
                const treatmentId = await Treatment.findById(req.body.treatmentsRecommended);
                const patient = await Patient.findById(patientId);

    

                if(!treatmentId){
                    return res.status(404).json({ message: 'Treatment not found.' });
                }
                if(patient.treatmentsRecommended.some(obj => obj.id === req.body.treatmentsRecommended)) {
                    return res.status(400).json({ message: 'Treatment already assigned' });
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

        getTreatmentsReport : async(req,res) => {

            const drOrManager = await Employee.findById(req.employee._id);

            if (!['General Manager', 'Doctor'].includes(drOrManager?.role)) {
                return res.status(400).send({msg : "You are not a general manager or a doctor"});
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

        getPatient: async(req,res) => {
            const patient = await Patient.findById(req.params.id);
            const drOrManager = await Employee.findById(req.employee._id);

            if (!['General Manager', 'Doctor'].includes(drOrManager?.role)) {
                res.status(400).send({msg: "You are not a general manager or patient's doctor"});
            }

              try{

                if(!patient) {
                    res.status(404).send({msg: "Patient doesn't exist"});
                }

                else{
                    return res.status(200).send(patient)
                }

              } catch(err) {
                 res.status(500).send({msg: "Internal error"})
              }
            
        },

        deletePatient: async(req,res) => {

            const patient = await Patient.findById(req.params.id);
            const drOrManager = await Employee.findById(req.employee._id);
            
            if (!['General Manager', 'Doctor'].includes(drOrManager?.role)) {
                return res.status(400).send({msg : "You are not a general manager or a doctor"});
            }

            try {

                if(patient) {
                    await Patient.findOneAndDelete({_id: req.params.id});
                    await Employee.updateMany(
                        { patients: req.params.id },
                        { $pull: { patients: req.params.id } }
                      );

                      res.status(200).send({msg: "Patient deleted"});
                }
                else {
                    return res.status(404).json({ message: 'Patient not found.' });
                  }


            } catch (err) {
                console.log(err);
                res.status(500).json({msg: "Internal error"})
            }

        },

        getTreatment: async (req,res) => {
            const treatment = await Treatment.findById(req.params.id);
            const drOrManager = await Employee.findById(req.employee._id);

            if(!['General Manager', 'Doctor'].includes(drOrManager?.role)) {
                res.status(400).send({msg: "You are not a general manager"});
            }

              try{

                if(!treatment) {
                    res.status(404).send({msg: "Treatment doesn't exist"});
                }

                else{
                    return res.status(200).send(treatment)
                }

              } catch(err) {
                 res.status(500).send({msg: "Interal error"})
              }
    },

    deleteTreatment: async(req,res) => {
        const treatment = await Treatment.findById(req.params.id);
        const drOrManager = await Employee.findById(req.employee._id);
        
        if (!['General Manager', 'Doctor'].includes(drOrManager?.role)) {
            return res.status(400).send({msg : "You are not a general manager or a doctor"});
        }

        try {

            if(treatment) {
                await Treatment.findOneAndDelete({_id: req.params.id});
                await Patient.updateMany(
                { "treatmentsRecommended.id": req.params.id },
                { $pull: { treatmentsRecommended: { id: req.params.id } } }
                );
                

                  res.status(200).send({msg: "Treatment deleted"});
            }
            else {
                return res.status(404).json({ message: 'Treatment not found.' });
              }


        } catch (err) {
            console.log(err);
            res.status(500).json({msg: "Internal error"})
        }
},



}


module.exports = controller;