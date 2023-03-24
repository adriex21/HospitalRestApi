const Employee = require('../models/Employee');
const Patient = require('../models/Patients');
const Treatment = require('../models/Treatments')


const controller = {

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
                await Patient.findOneAndUpdate(
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




}

module.exports = controller;