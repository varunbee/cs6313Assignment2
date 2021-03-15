const serviceModel = require('../models/service.model.js');
var ObjectID = require('mongodb').ObjectID;  

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
        listOfServices = '<html><body><center><h2>List of services:</h2><dl>'
        for (var i=0; i<services.length; i++) {
            // console.log(services[i])
            listOfServices += '<dt><a href="'+ services[i].location +'">' + services[i].name + '</br><i></a></dt><dd>' + services[i].description + '</dd><dd> - by ' + services[i].serviceProvider + '</dd></i></br>'+'<dd><u>Service added at: ' + services[i].serviceAddedTime + '</u></dd></br></hr></br>'
        }
        listOfServices+='</dl></center></body></html>'

        res.status(200).send(listOfServices);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the services."
        });
    });
}

//Delete service
exports.deleteService = (req, res) => {

}

//Disable service
exports.disableService = (req, res) => {

}

//Enable service
exports.enableService = (req, res) => {

}