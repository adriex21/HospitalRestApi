const mongoose = require('mongoose');

const {Schema} = mongoose;

const patient = new Schema({
    name: {type: String, required:true},
    gender: {type: String, required:true, enum:['Male', 'Female']},
    birthDate: {type: Date, required:true},
    adress: {type:String, required: true},
    phone: {type:String, required:true},
    doctor:{type:mongoose.Schema.Types.ObjectId, ref:'Employee'},
    assistants: [{type:mongoose.Schema.Types.ObjectId, ref:'Employee'}],
    treatmentsRecommended:[{type:mongoose.Schema.Types.Mixed, ref:'Treatments'}]

})  


module.exports = mongoose.model("Patients", patient);