  
const mongoose = require('mongoose');

const serviceUsageSchema = mongoose.Schema({
    serviceId: String,
    numberOfTimesHit: Number
});

var collectionName = 'sessionStore'

module.exports = mongoose.model('sessionStore', citySchema, collectionName);