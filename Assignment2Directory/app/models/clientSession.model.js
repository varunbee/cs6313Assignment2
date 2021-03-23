  
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const clientSessionsSchema = mongoose.Schema({
    _id: String,
    expires: String,
    session: String,
    contactEndPoint: {
        endpoint: String,
        expirationTime: String,
        keys: {
            p256dh: String,
            auth: String
        }
    },
});

var collectionName = 'clientSessions'

module.exports = mongoose.model('clientSessions', clientSessionsSchema, collectionName);