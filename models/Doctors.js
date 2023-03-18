const mongoose = require('mongoose');
const employee = require('./Employee')

const {Schema} = mongoose;

const doctor = new Schema({
    patients : [{type: mongoose.Schema.Types.ObjectId, ref: 'Patients'}],
    specialty : {type:String, required: true}
})

const doctorModel = employee.discriminator('Doctor', doctor);

  
module.exports = {Doctor: doctorModel};