module.exports = (app) => {
    const matMulController = require('../controllers/matMul.controller.js');

    app.get('/matMul', matMulController.matMulPage)

    app.post('/matMul',matMulController.performMatMul)

}