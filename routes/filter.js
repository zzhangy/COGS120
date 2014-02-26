var folderJson = require('../folders.json');

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

function foldersAlphaAsc(a,b) {
	return (a.folder_name).toLowerCase() - (b.folder_name).toLowerCase();
}

function foldersAlphaDesc(a,b) {
	return (b.folder_name).toLowerCase() - (a.folder_name).toLowerCase();
}

function foldersDateLatest(a,b) {
	var aDate = new Date(a), bDate = new Date(b);
	return bDate.getTime() - aDate.getTime();
}

function foldersDateOldest(a,b) {
	var aDate = new Date(a), bDate = new Date(b);
	return aDate.getTime() - bDate.getTime();
}