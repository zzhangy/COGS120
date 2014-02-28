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

	//$('#myModal1').modal('hide');
	highlightOn = !highlightOn;
	$("#colorsButton").popover('hide');

}


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
	$(".btn").click(function(){
	                $("#myModal").modal('show');
	            });
	// add a new note!
	/*$("#colorsButton").click(function(){
	                $("#myModal1").modal('show');
	            });*/
	var colorSelects = '<a href="#" class="foo" id="red" style="background-color:red" onClick="selectColor(this)"></a>'+
                                        '<a href="#" class="foo" id="green" style="background-color:green" onClick="selectColor(this)"></a>'+
                                        '<a href="#" class="foo" id="blue" style="background-color:blue" onClick="selectColor(this)"></a>'+
                                        '<a href="#" class="foo" id="yellow" style="background-color:yellow" onClick="selectColor(this)"></a>'+
                                        '<a href="#" class="foo" id="none" style="background-color:transparent" onClick="selectColor(this)"></a>';
	$("#colorsButton").popover({
		animation: true,
		html: true,
		placement: 'bottom',
		content: colorSelects
	});
	/*
	$('#colorsButton').click(function() {
		$("#colorsButton").popover('show');
	});*/
	$(".popover-top").popover('show');
});

$(document).click(function(e) {
$('#colorsButton').each(function() {
		//$("#colorsButton").popover('show');

        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
			if ($(this).data('bs.popover').tip().hasClass('in')) 
    		$(this).popover('toggle');
	        return;

        }
	});
	            
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
	$('#colorsButton').on('hide.bs.popover', function () {
  		//highlightOn = $('#hi-on').hasClass('active');
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
		'<a href="/home" onclick="delete_new_line(event, this);" class="btn-xs deleteNote"><i class="fa fa-times"></i></a></li>');

	//var newnote = $('<li><div contenteditable="true" class="note edit-note" data-tag="0" onclick="hello(this);" onkeypress="noteKeyPress(event)"></div></li>');
	notelist.append(newnote);

	$('#notelist li:last-child div').focus();
}

function delete_new_line(event, this_a) {
	event.preventDefault();
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

// use this with ajax if have time (how to pass folder/note ids?). for now going to refresh the page
function compileStuff() {
	var notes = '{{#each folder}}'+
                            '<li><a class="note_file" href="/read/{{../id}}/{{@index}}">{{this.title}}</a></li>'+
                        '{{/each}}';
    var tmplt = Handlebars.compile(notes);
    var data = {'folder':[
		{
			"date": "Tue Feb 18 2014",
			"title": "COGS 120 Week 7 NOTE 0/0",
			"notes": [
				{ "tag": "0", "note": "MongoDB"},
				{ "tag": "1", "note": "QUIZ on Tuesday! Watch videos before class  alalalallalal baoisehfoenlfljoiej iojijoisdj fods well\nnewline yay"},
				{ "tag": "0", "note": "why whitespace? can be used for grouping, pay attention to details"},
				{ "tag": "1", "note": "QUIZ on Tuesday! Watch videos before class"}
			]
		}
		]};
	var result = tmplt(data);
	console.log(result);
}
