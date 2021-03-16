const express = require('express');
var session = require('express-session');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
var parseurl = require('parseurl')
const cors = require('cors');
const cron = require('./config/cron.config.js');

// Configuring the database
const dbConfig = require('./config/db.config.js');

const db = require("./app/models");

// Connecting to the database
db.mongoose.connect(`mongodb://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to application Database!");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
});

// create express app
const app = express();

//use cors
app.use(cors())

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the directories main page! go to /serviceDirectory to access the directory."});
});

// Require ShopItem routes
require('./app/routes/service.routes.js')(app);

 //The 404 Route
app.get('*', function(req, res){
    res.status(404).send('<html><body><center><h1>Are ye lost mate?</h1></center></body></html>');
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000!");
});

//start cron job to expire lease
cron.serviceValidityChecker.start();