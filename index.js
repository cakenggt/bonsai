'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const http = require('http').Server(app);
const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL, {
  logging: false
});

const models = db.import(__dirname + '/models');

//sync all sequelize models
db.sync();

//parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({secret: process.env.DATABASE_URL}));

//Deliver the public folder statically
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

//This tells the server to listen
var port = process.env.PORT;
http.listen(port, function(){
  console.log('Example app listening on port '+port+'!');
});

//This is the options object that will be passed to the api files
let apiOptions = {
  app: app,
  models: models
};

//Load the api versions
require('./api/v1')(apiOptions);

/*
* This tells the server to always serve index.html no matter what,
* excluding the previously defined api routes. This is so we can use
* react-router's browserHistory feature.
*/
app.get('*', function(req, res){
  res.sendFile(__dirname+'/public/html/index.html');
});
