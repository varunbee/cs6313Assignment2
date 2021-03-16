  
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const serviceSchema = mongoose.Schema({
    _id: ObjectId,
    name: String,
    location: String,
    description: String,
    serviceProvider: String,
    leaseDuration: Number,
    active: Boolean,
    serviceAddedTime: Number,
});

var collectionName = 'serviceStore'

module.exports = mongoose.model('serviceStore', serviceSchema, collectionName);