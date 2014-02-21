var userJson = require('../users.json');
var noteJson = require('../sampleNote.json');
var folderJson = require('../folders.json');

var deletedFolder = {};
var deletedNote = {};
var deletedLine = {};

// all of these used for last deleted item! ex. note line uses all 3 ids
var deletedFolderId = 0,
	deletedNoteId = 0,
	deletedLineId = 0;

var justDeleted = 0;

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

function updateFolderDate(date_string, folder_id) {
	var this_date = new Date(date_string); // delete?
	var last_updated = folderJson['folders'][folder_id].last_updated;
	var date_updated = new Date(last_updated);

	var time_now = this_date.getTime();
	var time_folder = date_updated.getTime();
	if (!isNaN(time_now) && !isNaN(time_folder)) {
		if (time_now > time_folder)
			folderJson['folders'][folder_id].last_updated = date_string;
	}
}

function getFolderDate(folder_id) {
	var folder = folderJson['folders'][folder_id].folder;
	var folder_length = folder.length;
	if (folder_length > 0) {
		var latest_date = folder[0].date;
		var time_latest = (new Date(folder[0].date)).getTime();
		//if nan, report error?
		if (!isNaN(time_latest)) {
			for (var i=1; i<folder_length; ++i) {
				var this_date = folder[i].date;
				var time_this = (new Date(this_date)).getTime();
				if (!isNaN(time_this))
					if (time_this > time_latest) {
						time_latest = time_this;
						latest_date = this_date;
					}
			}
		}

		folderJson['folders'][folder_id].last_updated = latest_date;
	}
}

exports.deleteFolder = function(req, res){
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check Nan

	// delete and save
	var deleted_folder_arr = folderJson['folders'].splice(folder_id, 1);
	if (deleted_folder_arr.length > 0) {
		deletedFolder = deleted_folder_arr[0];
		deletedFolderId = folder_id;
		justDeleted = 1;
	}

	res.redirect('/home');
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

function current_date() {
            var d = new Date();
            //return d.toDateString();
            return (d.getMonth()+1) + "/" +
                        d.getDate() + "/" +
                        d.getFullYear();
}

exports.newFolder = function(req, res){
	res.render('newFolder');
};

exports.addFolder = function(req, res){
	var folder_name = req.body.folder_name;
	var date = current_date();
	var folder_json = {
		'folder_name': folder_name,
		'last_updated': date,
		'folder': []
	};

	//var newfolder_id = folderJson['folders'].length;
	folderJson['folders'].push(folder_json);

	//res.redirect('/folder/' + newfolder_id);
	res.redirect('/home');
};

exports.submitEditFolder = function(req, res){
	var folder_name = req.body.folder_name;
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check Nan

	folderJson['folders'][folder_id].folder_name = folder_name;

	//res.redirect('/folder/' + folder_id);
	res.redirect('/edit/' + folder_id);
};

exports.editFolder = function(req, res){
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check Nan

	var folders = folderJson['folders'];
	var folder = folders[folder_id];
	folder.id = folder_id;

	res.render('editFolder', folder);
};

exports.newNote = function(req, res){
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check Nan
	res.render('new', {'id': folder_id});
};

exports.moveNote = function(req, res) {
	var note_string   = req.params.note;
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check if Nan
	var note_id = parseInt(note_string, 10);

	var folders = folderJson['folders'];
	var removed_arr = folders[folder_id].folder.splice(note_id, 1);
	if (removed_arr.length > 0) {
		var note_to_move = removed_arr[0];
		//note_to_move
		//var folders = folderJson['folders'];
	}
};

exports.addNote = function(req, res){
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check if Nan
	var note_string = req.body.noteField;
	var json = JSON.parse(note_string);

	var folders = folderJson['folders'];
	var newnote_id = folders[folder_id].folder.length;
	folders[folder_id].folder.push(json);
	updateFolderDate(json.date, folder_id);
	//console.log(json);
	//console.log(newnote_id);
	//console.log(folders[folder_id]);
	//console.log('/read/' + folder_id + '/' + newnote_id);
	res.redirect('/read/' + folder_id + '/' + newnote_id);
};

exports.submitEditNote = function(req, res){
	var note_string   = req.params.note;
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check if Nan
	var note_id = parseInt(note_string, 10);
	var note_jstring = req.body.noteField;
	var json = JSON.parse(note_jstring);

	var folders = folderJson['folders'];
	//var newnote_id = folders[folder_id].folder.length;
	folders[folder_id].folder[note_id] = json;
	json.date = current_date();
	updateFolderDate(json.date, folder_id);

	//console.log(json);
	//console.log(folders[folder_id]);
	//console.log('/read/' + folder_id + '/' + note_id);

	//res.redirect('/read/' + folder_id + '/' + note_id);
	res.redirect('/edit/' + folder_id + '/' + note_id);
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
	/* ER MA GOD IT WORKS HALLEFKINLUJAHHHH
	var newnote = {
			"date": "02/14/2014",
			"title": "COGS 120 Week 8 new",
			"notes": [
				{ "tag": "0", "note": "Hallelujah"},
				{ "tag": "1", "note": "QUIZ on Tuesday! Watch videos before class  alalalallalal baoisehfoenlfljoiej iojijoisdj fods well\nnewline yay"},
				{ "tag": "0", "note": "why whitespace? can be used for grouping, pay attention to details"}
			]
		};
folders[0].folder.push(newnote);
	console.log('----');
	*/
	//var json = noteJson; // error-format?	
	note.f_id = folder_id;
	note.n_id = note_id;
	res.render('edit', note);
};

exports.deleteNote = function(req, res){
	var note_string   = req.params.note;
	var folder_string = req.params.folder;

	var note_id = parseInt(note_string, 10);// check if isNan(note_id) => error, 404?
	var folder_id = parseInt(folder_string, 10);

	var folders = folderJson['folders'];
	var deleted_note_arr = folders[folder_id].folder.splice(note_id, 1); // only if exist
	
	// save deleted note!
	if (deleted_note_arr.length > 0) {
		deletedNote = deleted_note_arr[0];
		deletedFolderId = folder_id;
		deletedNoteId = note_id;
		justDeleted = 1;
	}
	// check error if none exist, or show empty page
	getFolderDate(folder_id);

// disply undo message 
	//res.redirect('/folder/' + folder_id);
	res.redirect('/edit/' + folder_id);
};

exports.deleteNoteLine = function(req, res){
	var note_string   = req.params.note;
	var folder_string = req.params.folder;
	var note_num_string = req.params.note_num;

	var note_id = parseInt(note_string, 10);// check if isNan(note_id) => error, 404?
	var folder_id = parseInt(folder_string, 10);
	var note_num = parseInt(note_num_string, 10);

	var folders = folderJson['folders'];
	var note_line_arr = folders[folder_id].folder[note_id].notes.splice(note_num, 1); // only if exist
	if (note_line_arr.length > 0) {
		var deletedLine = note_line_arr[0];
		deletedLineId = note_num;
		deletedNoteId = note_id;
		deletedFolderId = folder_id;
		justDeleted = 1;
	}
	// check error if none exist, or show empty page

// disply undo message 
	//res.redirect('/read/' + folder_id + '/' + note_id);
	res.redirect('/edit/' + folder_id + '/' + note_id);
};

function parseIfInt(num_string) {
	var maybe_num = parseInt(num_string);
	// check if NaN
}

exports.viewFolder = function(req, res){
	// folder json!
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10);
	var folders = folderJson['folders'];
	var folder = folders[folder_id];
	folder.id = folder_id;
	res.render('folder', folder);
};

exports.viewFolders = function(req, res){
	// folder json!

	var folders = folderJson;
//console.log(folders);
	res.render('home', { 'home': folders, helpers: {setIndex: function(value){
                this.index = Number(value);}}});
};