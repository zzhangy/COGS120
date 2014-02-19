var userJson = require('../users.json');
var noteJson = require('../sampleNote.json');
var folderJson = require('../folders.json');

exports.checkLogin = function(req, res) {
	//console.log(users);
	var userArr = userJson.users;
	var i = 0, numUsers = userArr.length;
	var email = req.query.email;
	var password = req.query.password;
	var valid = false;

	for (;i < numUsers; i++) {
		var user = userArr[i];
		if (user.email == email && user.password == password) {
			valid = true;
		}
	}
	
	res.json({"isUser": valid});
};

exports.getRead = function(req, res){
	var json = noteJson;
	console.log(json);
	res.render('read', json);
};

exports.generateRead = function(req, res){
	var note_string = req.body.noteField;
	var json = JSON.parse(note_string);
	console.log(json);
	res.render('read', json);
};

exports.readNote = function(req, res){
	var note_string   = req.params.note;
	var folder_string = req.params.folder;

	var note_id = parseInt(note_string, 10);// check if isNan(note_id) => error, 404?
	var folder_id = parseInt(folder_string, 10);
	//console.log ((typeof note_id) + " " + (typeof folder_id)); //number

	var folders = folderJson['folders'];
	var note = folders[folder_id].folder[note_id];

	//var json = noteJson; // error-format?	
	res.render('read', note);
};

exports.editNote = function(req, res){
	var note_string   = req.params.note;
	var folder_string = req.params.folder;

	var note_id = parseInt(note_string, 10);// check if isNan(note_id) => error, 404?
	var folder_id = parseInt(folder_string, 10);
	//console.log ((typeof note_id) + " " + (typeof folder_id)); //number

	var folders = folderJson['folders'];
	var note = folders[folder_id].folder[note_id];

	//var json = noteJson; // error-format?	
	res.render('edit', note);
};

exports.openFolder = function(req, res){
	// folder json!
	var note_id = req.params.note;
	var folder_id = req.params.folder;
	res.render('folder');
};

/*exports.view = function(req, res){
  res.render('index', {"fail": false});
};

exports.processLogin = function(req, res) {
	if (validateLogin(req,res)) {
		console.log("logging in to home");
		res.statusCode = 302;
				res.redirect("/failure");

		//res.setHeader('Location', "/signup.html");
		res.end();
	}
	else {
		// error // fix later
		res.statusCode = 302;
		res.setHeader('Location', "/login/failure");
		res.end();
	}
};

function validateLogin(request, response) {
	//return true;
	return true;
}

exports.loginFailure = function(req,res) {
	console.log("FAIL ------------");
	res.render('index', {"fail": true});
};*/