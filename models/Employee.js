const mongoose = require('mongoose');
const {Schema} =  mongoose;

const employee = new Schema({
    name: {type:String, },
    password: {type:String, },
    email: {type:String, unique:true},
    role: {type:String, required:true, enum: ['None','Doctor', 'Assistant', 'General Manager'], default: 'None'}
})

module.exports = mongoose.model("Employee", employee);

