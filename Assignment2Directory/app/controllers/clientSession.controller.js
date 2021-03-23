const serviceModel = require('../models/service.model.js');
const clientSessionModel = require('../models/clientSession.model.js');
var ObjectID = require('mongodb').ObjectID;  
const session = require('express-session');

//Add end point
exports.addEndPoint = (req, res) => {
    // console.log("Session ID:  ", req.sessionID)
    // console.log("Session body:  ", req.body)
    clientSessionModel.findOneAndUpdate({'_id': req.sessionID}, {$set:{'contactEndPoint': req.body}}, {new: true}).then(data => {
        // console.log('New client data: ', data)
        res.status(200).send({'message': 'End point added for client'})
    })
}