/**
 * Introduction to Human-Computer Interaction
 * Lab 2
 * --------------
 * Created by: Michael Bernstein
 * Last updated: December 2013
 */
var PORT = 3000;

// Express is a web framework for node.js
// that makes nontrivial applications easier to build
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');

/* IMPORT ROUTES */
var index = require('./routes/index');
// Example route
// var user = require('./routes/user');

// Create the server instance
var app = express();

// Print logs to the console and compress pages we send
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.logger('dev'));
app.use(express.compress()); //
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);

// Return all pages in the /static directory
// whenever they are requested at '/'
// e.g., http://localhost:3000/index.html
// maps to /static/index.html on this machine
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* ADD ROUTE TO APP */
app.get('/checkLogin', index.checkLogin);
app.post('/readNote', index.generateRead); //submitting
app.get('/readNote', index.getRead); //read sample note
app.get('/read/:folder/:note', index.readNote);
app.get('/folder/:folder/:note', index.openFolder);
app.get('/edit/:folder/:note', index.editNote);
//app.get('/failure', index.loginFailure);
// Example route
// app.get('/users', user.list);

// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});