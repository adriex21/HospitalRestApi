const mongoose = require('mongoose');
const {Schema} =  mongoose;

const employee = new Schema({
    name: {type:String, required:true},
    password: {type:String, required :true},
    email: {type:String, required:true, unique:true},
    role: {type:String, required:true, enum: ['Doctor', 'Assistant', 'General Manager']}
})

module.exports = mongoose.model("Employee", employee);

