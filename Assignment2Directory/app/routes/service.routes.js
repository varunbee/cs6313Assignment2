module.exports = (app) => {
    const serviceController = require('../controllers/service.controller.js');

    app.get('/serviceDirectory',serviceController.getServices)

    app.put('/service', serviceController.addService)

    app.delete('/service', serviceController.deleteService)

    // getCountry
    app.get('/getSesson', (req, res)=>{
        res.json({"message": "Sesson!"});
        console.log("Hi")
    });

}