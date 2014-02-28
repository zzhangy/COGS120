'use strict';

function current_date() {
            var d = new Date();
            //return d.toDateString();
            return (d.getMonth()+1) + "/" +
                        d.getDate() + "/" +
                        d.getFullYear();
}

function selectColor(e) {
	var color = $(e).attr('id');
	console.log(color);
	$(e).css('border-width',"3px");
}

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
	$(".btn").click(function(){
	                $("#myModal").modal('show');
	            });
	// add a new note!
	$(".glyphicon-tag").click(function(){
	                $("#myModal1").modal('show');
	            });
});

/*
 * Function that is called when the document is ready.
 */
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
	// consider for notes too! but need to attach handler when creating
	$('#addNewButton').click(addNote);
	$('#date').text(current_date());
}

function hello(thisdiv) {
	thisdiv.style.backgroundColor = 'yellow';
	thisdiv.dataset.tag = "0";
}

function addNote(e) {
	var newnote = $('<li><div contenteditable="true" class="note edit-note" data-tag="0"></di></li>');
	//var newnote = $('<li><textarea onkeyup="new resize_input(this);" virtual rows="1" class="note"></textarea></li>');
	//var newnote = $('<li><input type="text" class="note"></input></li>');
	var notelist = $('#notelist');
	notelist.append(newnote);

	$('#notelist li:last-child div').focus();
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
	var date = $('#date').text(); // date\n
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