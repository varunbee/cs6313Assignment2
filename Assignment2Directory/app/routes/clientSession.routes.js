module.exports = (app) => {
    const clientSessionController = require('../controllers/clientSession.controller.js');

    app.post('/endPoint', clientSessionController.addEndPoint)
}