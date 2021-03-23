const serviceModel = require('../models/service.model.js');
const clientSessionModel = require('../models/clientSession.model.js');
var ObjectID = require('mongodb').ObjectID;  
const webpush = require('web-push')
const session = require('express-session');

const vapidKeys = {
    publicKey:
      'BNYBeiK2Obko6wU6MKyLd7kZjBrE9Usbn4ow7tjdKInFm8lgvHiD5VPtvY2ZJbM1YGzjlb4SZamTvi194ZgcZD4',
    privateKey: 'NifGhMx4GiTbM0MXw0BwenjqqWV5Dvyf4F_dSaE3NyM',
}

//setting our previously generated VAPID keys
webpush.setVapidDetails(
    'mailto:12022012@umail.ucc.ie',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

//Add service
exports.addService = (req, res) => {
    if(req.body){
        //Create service body
        const service = new serviceModel({
            name: req.body.name,
            resourceLocation: req.body.location,
            serviceProvider: req.body.providerName,
            leaseDuration: req.body.lease,
            active: True,
            serviceAddedTime: new Date().getTime()
        })

        //Save the service
        service.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the service."
            });
        });
    } else {
        res.status(500).send({
            message: "Error while parsing body of request"
        });
    }
}

//Get all services
exports.getServices = (req, res) => {
    serviceModel.find()
    .then(services => {
        // console.log(services)
        // res.send(shopItem);
        // res.setHeader('Content-Type', 'application/json');
        listOfServices = []
        for (var i=0; i<services.length; i++) {
            // console.log(services[i])
            listOfServices.push(services[i])
        }

        res.status(200).send(listOfServices);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the services."
        });
    });
}

exports.isClientLeaseValid = (req, res) => {
    const id = req.query.id
    console.log("ID:" + id)
    clientSessionModel.findById({'_id': id}).then(session => {
        if(session){
            // console.log("Expires: " + session.expires)
            // console.log("Session: ", session)
            // console.log("is valid? : " + new Date(session.expires).getTime() + " " + new Date().getTime())
            return res.status(200).send(new Date(session.expires).getTime() > new Date().getTime());
        }
        return res.status(200).send(false)
    })
}

//Delete service
exports.deleteService = (req, res) => {
    console.log('delete service called...')
    message = {
        title: "Service status update",
        message: "Service MatMul has been deleted and is no longer available."
    }
    clientSessionModel.find().then(clients =>{
        // console.log('Clients found: ', clients)
        for (var i = 0; i < clients.length; i++){
            // if(new Date(client.expires).getTime() > new Date().getTime()){
                
            // }
            const endPoint = clients[i].contactEndPoint.endpoint
            if(endPoint){
                console.log("EndPoint: ", endPoint)
                sendNotification(clients[i].contactEndPoint, JSON.stringify(message))
            }
        }
        res.status(200).send({'message': 'Notifications sent on service delete.'})
    })
}

//Disable service
exports.disableService = (req, res) => {
    
}

//Enable service
exports.enableService = (req, res) => {

}

//No service
exports.noService = (req, res) => {
    res.status(200).send("<html><body><h2>Service lease expired.</h2><h3>Redirecting to directory page...</h3>")
}

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend='') => {
    webpush.sendNotification(subscription, dataToSend)
}
