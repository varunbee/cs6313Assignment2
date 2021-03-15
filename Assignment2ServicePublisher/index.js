const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// create express app
const app = express();

//use cors
app.use(cors())

// parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to server providers main page!"});
});

// Require ShopItem routes
require('./app/routes/matMul.route.js')(app);

 //The 404 Route
app.get('*', function(req, res){
    res.status(404).send('<html><body><center><h2>Are ye lost matie?</h2></center></body></html>');
});

// listen for requests
app.listen(3001, () => {
    console.log("Server is listening on port 3001!");
});

//start cron jobs
// cron.test.start();