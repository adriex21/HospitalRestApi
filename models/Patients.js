const mongoose = require('mongoose');

const {Schema} = mongoose;

const patient = new Schema({
    name: {type: String, required:true},
    gender: {type: String, required:true, enum:['Male', 'Female']},
    birthDate: {type: Date, required:true},
    adress: {type:String, required: true},
    phone: {type:String, required:true},
    doctor:{type:mongoose.Schema.Types.ObjectId, ref:'Employee'},
    assistans: [{type:mongoose.Schema.Types.ObjectId, ref:'Employee'}],
    treatments:[{type:mongoose.Schema.Types.ObjectId, ref:'Treatments'}]
})  


module.exports = mongoose.model("Patients", patient);