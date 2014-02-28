var folderJson = require('../folders.json');
var handlebars = require('express3-handlebars');

exports.searchLines = function(req, res) {
	var search_string = req.params.color;
	var found_lines = search(search_string);
	res.json(found_lines);
};

exports.showSearch = function(req, res) {
	res.render('search');
};

function search(tag_string) {
	var found_lines = [];
	var folders = folderJson.folders;
	var fi = 0;
	var folder_length = folders.length;
	for (; fi < folder_length; ++fi) {
		// folder
		var folder_obj = folders[fi];
		var folder_arr = folder_obj.folder;
		var ni = 0;
		var notes_length = folder_arr.length;
		for (; ni < notes_length; ++ni) {
			var note = folder_arr[ni];
			var notes_arr = note.notes;
			var li = 0;
			var lines_length = notes_arr.length;
			for (; li < lines_length; ++li) {
				var note_line = notes_arr[li];
				if (note_line.tag == tag_string) {
					//
					var line_obj = {
						'note': note_line.note,
						'id' : {
							'line': li,
							'note': ni,
							'folder': fi
						},
						'text' : {
							'note_name': note.title,
							'folder_name': folder_obj.folder_name
						}
					};
					found_lines.push(line_obj);
				}
			}
		}
	}
	console.log(found_lines);
	return found_lines;
}

exports.sortFolders = function(req, res) {
		console.log ('waeeeeeeeeeeeeeeeeee');

	var folders = folderJson['folders'];
	var sortType = req.params.sortType;

	if (sortType == "alpha") {
		console.log('aniyooooo');
		folders.sort(foldersNameAsc);
	}
	else if (sortType == "alphadesc") {
		console.log('ahhhhhhhhhhhhhh');
		folders.sort(foldersNameDesc);
	}
	else if (sortType == "latest") {
		folders.sort(foldersDateLatest);
	}
	else if (sortType == "oldest"){
		folders.sort(foldersDateOldest);
	}
	res.redirect('/home');
};

exports.sortNotes = function(req, res) {
	var sortType = req.params.sortType;
	var folder_string = req.params.folder;
	var folder_id = parseInt(folder_string, 10); //check Nan
	var folder = folderJson['folders'][folder_id].folder;

	if (sortType == "alpha") {
		folder.sort(notesNameAsc);
	}
	else if (sortType == "alphadesc") {
		folder.sort(notesNameDesc);
	}
	else if (sortType == "latest") {
		folder.sort(notesDateLatest);
	}
	else if (sortType == "oldest"){
		folder.sort(notesDateOldest);
	}

	res.redirect('/edit/' + folder_id);
};

function foldersNameAsc(a,b) {
	return ((a.folder_name).toLowerCase()).localeCompare((b.folder_name).toLowerCase());
}

function foldersNameDesc(a,b) {
	return ((b.folder_name).toLowerCase()).localeCompare((a.folder_name).toLowerCase());
	//return (b.folder_name).toLowerCase() - (a.folder_name).toLowerCase();
}

function foldersDateLatest(a,b) {
	var aDate = new Date(a.last_updated), bDate = new Date(b.last_updated);
	return bDate.getTime() - aDate.getTime();
}

function foldersDateOldest(a,b) {
	var aDate = new Date(a.last_updated), bDate = new Date(b.last_updated);
	return aDate.getTime() - bDate.getTime();
}





function notesNameAsc(a,b) {
	return ((a.title).toLowerCase()).localeCompare((b.title).toLowerCase());
}

function notesNameDesc(a,b) {
	return ((b.title).toLowerCase()).localeCompare((a.title).toLowerCase());
}

function notesDateLatest(a,b) {
	var aDate = new Date(a.date), bDate = new Date(b.date);
	return bDate.getTime() - aDate.getTime();
}

function notesDateOldest(a,b) {
	var aDate = new Date(a.date), bDate = new Date(b.date);
	return aDate.getTime() - bDate.getTime();
}