var userJson = require('../users.json');
var noteJson = require('../sampleNote.json');

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

exports.editNote = function(req, res){
	var json = noteJson;
	console.log('------');
	console.log(json);
	res.render('edit', json);
};

exports.openFolder = function(req, res){
	// folder json!

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