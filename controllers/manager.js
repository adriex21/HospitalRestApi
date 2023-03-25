const Employee = require('../models/Employee');
const Patient = require('../models/Patients');

const controller = {

createDoctor: async(req, res) => {
    const { employeeId, specialty } = req.body;
    const manager = await Employee.findById(req.employee._id);

    if (manager.role !== 'General Manager') {
        return res.status(400).send({msg : 'You are not a general manager'});
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
        return res.status(400).send({msg : 'You are not a general manager'});
    }

    if(req.body.role) {
        return res.status(400).send({msg : 'You cannot modify the role'});
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
        return res.status(400).send({msg : 'You are not a general manager'});
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

getDoctorsReport: async(req,res) => {

    const manager = await Employee.findById(req.employee._id);

    if (!['General Manager'].includes(manager?.role)) {
        return res.status(400).send({msg : "You are not a general manager"});
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

getDoctor: async (req,res) => {

    const doctor = await Employee.findById(req.params.id);
    const manager = await Employee.findById(req.employee._id);

    if(manager.role !== 'General Manager') {
        res.status(400).send({msg: "You are not a general manager"});
    }

      try{

        if(!doctor) {
            res.status(404).send({msg: "Doctor doesn't exist"});
        }

        if(doctor.role !== 'Doctor') {
            res.status(400).send({msg: "Not a doctor"});
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
        res.status(400).send({msg: "You are not a general manager"});
    }

    if(!doctor || doctor.role !== 'Doctor') {
        res.status(404).send({msg: "Doctor doesn't exist"});
    }

    try {

        if(doctor) {
            await Employee.findOneAndDelete({_id: req.params.id});
            await Patient.updateMany(
                { doctor: req.params.id },
                { $set: { doctor: null } }
              );
              
            res.status(200).send({msg: "Doctor deleted"})
        }
          

    } catch (err) {
        console.log(err);
        res.status(500).json({msg: "Internal error"})
    }


},


getAssistant: async (req,res) => {

    const assistant = await Employee.findById(req.params.id);
    const manager = await Employee.findById(req.employee._id);

    if(manager.role !== 'General Manager') {
        res.status(400).send({msg: "You are not a general manager"});
    }

      try{

        if(!assistant) {
            res.status(404).send({msg: "Assistant doesn't exist"});
        }

        if(assistant.role !== 'Assistant') {
            res.status(400).send({msg: "Not an assistant"});
        } 
        else{
            return res.status(200).send(assistant)
        }



      } catch(err) {
         res.status(500).send({msg: "Interal error"})
      }
    
    
},

deleteAssistant: async(req,res) => {

    const assistant = await Employee.findById(req.params.id);
    const drOrManager = await Employee.findById(req.employee._id);
    
    if (!['General Manager'].includes(drOrManager?.role)) {
        return res.status(400).send({msg : "You are not a general manager"});
    }

    try {

        if(assistant) {
            await Employee.findOneAndDelete({_id: req.params.id});
    
              await Patient.updateMany(
                { "assistants": req.params.id },
                { $pull: { assistants: req.params.id } }
);

              res.status(200).send({msg: "Assistant deleted"});
        }
        else {
            return res.status(404).json({ message: 'Assistant not found.' });
          }


    } catch (err) {
        console.log(err);
        res.status(500).json({msg: "Internal error"})
    }


},


}

module.exports = controller;