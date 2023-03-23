const mongoose = require('mongoose');
const {Schema} = mongoose;

const treatment = new Schema({
    name:{type:String, required : true},
    description:{type:String, required:true},
    medication : [],
})

module.exports = mongoose.model('Treatments', treatment);