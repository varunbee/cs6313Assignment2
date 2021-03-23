const express = require('express');
var session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
var parseurl = require('parseurl')
const cors = require('cors');
const cron = require('./config/cron.config.js');
const sessionConfig = require('./config/session.config')
const mySecret = sessionConfig.SECRET;
const path = require('path');
const fs = require('fs').promises;
const twoMinutes = 120000

// Configuring the database
const env = "PROD"

var dbConfig = require('./config/db.dev.config.js')

if (env == "PROD"){
    dbConfig = require('./config/db.prod.config.js')
} 

const db = require("./app/models");

const mongoConnString = `mongodb://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`

// Connecting to the database
db.mongoose.connect(mongoConnString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

//Use express session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: mySecret,
    store: MongoStore.create({mongoUrl: mongoConnString, dbName: dbConfig.DB, collectionName: sessionConfig.COLLECTION_NAME}),
    cookie: { secure: true, maxAge: 120000 }
  }));

app.use(function (req, res, next) {
    //console.log("req: ", req)
    if (!req.session.views) {
        req.session.views = {}
    }

    // get the url pathname
    var pathname = parseurl(req).pathname

    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

    next()
})

// define a simple route
app.get('/', (req, res) => {
    // res.json({"message": "Welcome to the directories main page! go to /serviceDirectory to access the directory."});
    fs.readFile(__dirname + "/index.html")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    });
});

app.get('/index.js', (req, res) => {
    fs.readFile(__dirname + "/index.js")
    .then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    });
});

app.get('/public/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "service-worker.js"));
});

// Require service routes
require('./app/routes/service.routes.js')(app);

// Require clientSession routes
require('./app/routes/clientSession.routes.js')(app);

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