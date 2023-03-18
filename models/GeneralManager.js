const mongoose = require('mongoose');
const employee = require('./Employee');

const {Schema} = mongoose;

const generalManager = new Schema({

});

const generalManagerModel = employee.discriminator('GeneralManager', generalManager);

module.exports = {GeneralManager: generalManagerModel};