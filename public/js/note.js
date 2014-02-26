'use strict';
var savedColor = "none";
var savedColorTag = "0";
var highlightOn = false;
var lastColored = null;

function current_date() {
            var d = new Date();
            return d.toDateString();
            /*return (d.getMonth()+1) + "/" +
                        d.getDate() + "/" +
                        d.getFullYear();*/
}

function colorToTag () {
	if (savedColor == "yellow")     return "1";
	else if (savedColor == "red")   return "2";
	else if (savedColor == "blue")  return "3";
	else if (savedColor == "green") return "4";
	else							return "0";
}

function selectColor(e) {
	var color = $(e).attr('id');
	savedColor = color;
	savedColorTag = colorToTag();
	if (lastColored != null) {
		lastColored.style.borderWidth = '1px';
	}
	lastColored = e;
	$(e).css('border-width',"3px");

	$('#myModal1').modal('hide');
}


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
	$(".btn").click(function(){
	                $("#myModal").modal('show');
	            });
	// add a new note!
	$("#colorsButton").click(function(){
	                $("#myModal1").modal('show');
	            });
    /*$(".popover-top").popover({
        placement : 'top'
    });*/
	$(".popover-top").popover('show');
});

/*
 * Function that is called when the document is ready.
 */

function noteKeyPress(e) {
	if (e.which == 13) {
		e.preventDefault();
		addNote(e);
	}
}
function initializePage() {
	$('#newnote').click(addNote);
	$('#submitNote').click(submitNewNote);
	$('#title').keypress(function(e) {
		if (e.which == 13) {
			var notes = $('.note');
			if (notes.length == 0)
				addNote(e);
		}
	});
	$('.note').on('keypress', function(e) {
		noteKeyPress(e);
	});
	// consider for notes too! but need to attach handler when creating
	$('#addNewButton').click(addNote);
	$('#deleteTool').click(function() {
		$('#deleteForm').submit();
	});
	$('#date').text(current_date());
	$('#myModal1').on('hide.bs.modal', function () {
  		highlightOn = $('#hi-on').hasClass('active');
		$('#colorsButtonIcon').css('color', '#fff');
		if (highlightOn) {
			if (savedColor != "none")
				$('#colorsButtonIcon').css('color', savedColor);
		}
	});
	$('.collapse').collapse();
}


function hello(thisdiv) {
	//thisdiv.style.backgroundColor = 'yellow';
	if (highlightOn) {
		if (thisdiv.dataset.tag != savedColorTag)
			thisdiv.dataset.tag = savedColorTag;
		else
			thisdiv.dataset.tag = "0";
	}
}

function addNote(e) {
	var notelist = $('#notelist');
	//var line_num = notelist.children().length;

	var newnote = $('<li><div contenteditable="true" class="note edit-note" data-tag="0" onclick="hello(this);" onkeypress="noteKeyPress(event)"></div>'+
	//	'<a href="/delete/'+curr_note_folder+'/'+curr_note+'/'+line_num+'" class="btn-xs deleteNote"><i class="fa fa-times"></i></a></li>');
		'<a href="delete_new_line(this)" class="btn-xs deleteNote"><i class="fa fa-times"></i></a></li>');

	//var newnote = $('<li><div contenteditable="true" class="note edit-note" data-tag="0" onclick="hello(this);" onkeypress="noteKeyPress(event)"></div></li>');
	notelist.append(newnote);

	$('#notelist li:last-child div').focus();
}

function delete_new_line(this_a) {
	$(this_a).parent().remove();
}

function submitNewNote(e) {
	e.preventDefault();

	var notes = $('.note');
	var numNotes =  notes.length;
	var note_arr = [];
	for (var i = 0; i < numNotes; i++) {
		var note = $(notes[i]).text();
		console.log($(notes[i]).html());
		var tag = $(notes[i]).data('tag');
		var note_json = {"tag": tag, "note": note}; // tag is for highlight
		note_arr.push(note_json);
	}
	//var date = $('#date').text(); // date\n
	var date = current_date();
	var title = $('#title').val();

	var note_wrapper = {
		"date" : date,
		"title" : title,
		"notes" : note_arr};
		//console.log(note_wrapper);


	var form = $('#submitForm');
	var inputdata = $('<input name="noteField" id="noteField" hidden></input>');
	inputdata.val(JSON.stringify(note_wrapper));
	form.append(inputdata);
	form.submit();
	
}

$(document).ready(function () {
  $('[data-toggle=offcanvas]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
});
// goal later: put focus at end of input