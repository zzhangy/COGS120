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
var filter = require('./routes/filter');
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

/*
handlebars.registerHelper('setIndex', function(value){
    this.index = parseInt(value); //I needed human readable index, not zero based
});*/

/* ADD ROUTE TO APP */
app.get('/checkLogin', index.checkLogin);

app.post('/readNote', index.generateRead); //submitting
app.post('/delete/:folder/:note', index.deleteNote); //submitting // to delete later
app.get('/delete/:folder/:note/:note_num', index.deleteNoteLine); //submitting // to delete later


// notes // rename later to be same names
app.post('/add/:folder', index.addNote);				// post from add
app.post('/edit/:folder/:note', index.submitEditNote);	// post from edit
														// post(a) del

app.get('/new/:folder', index.newNote); 		// add note to folder
app.get('/read/:folder/:note', index.readNote); // read
app.get('/edit/:folder/:note', index.editNote); // edit 
												// delete

app.get('/new', index.newFolder); // warning: no notes! error proof it
app.get('/edit/:folder', index.editFolder); // warning: no notes! error proof it
app.post('/add', index.addFolder);
app.post('/edit/:folder', index.submitEditFolder);
app.post('/delete/:folder', index.deleteFolder);

app.post('/move/:folder/:note/:tofolder', index.moveNote);


// folders
app.get('/folder/:folder', index.viewFolder);	// read

app.get('/home', index.viewFolders);			// read all folders
app.get('/search/:color', filter.searchLines);
app.get('/search', filter.showSearch);


app.get('/readNote', index.getRead); //read sample note

// should be post
app.get('/sort/:sortType', filter.sortFolders);
app.get('/sort/:folder/:sortType', filter.sortNotes);
// Example route
// app.get('/users', user.list);
/*
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.formt('html')) {
    res.render('404', { 'url': req.url });
    return;
  }

  // respond with json
  if (req.format('json')) {
    res.send({ 'error': 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});*/

// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});