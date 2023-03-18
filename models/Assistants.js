const mongoose = require('mongoose');
const employee = require('./Employee');

const {Schema} = mongoose;

const assistant = new Schema({
    patients:[{type:mongoose.Schema.Types.ObjectId, ref: 'Patients'}]
})

const asssistantModel = employee.discriminator('Assistant', assistant)

module.exports = {Assistant: asssistantModel};