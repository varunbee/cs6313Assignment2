module.exports = (app) => {
    const serviceController = require('../controllers/service.controller.js');

    app.get('/service',serviceController.getServices)

    app.put('/service', serviceController.addService)

    app.delete('/service', serviceController.deleteService)

    app.get('/noService', serviceController.noService)

    app.get('/checkClientLease', serviceController.isClientLeaseValid)

}