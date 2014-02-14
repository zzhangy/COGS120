'use strict';

/*window.onload = function() {
  var input = document.getElementById("#title").focus();
}

*/


// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('#newnote').click(addNote);
}

function addNote(e) {
	console.log('see');
	var newnote = $('<li><input type="text"></input></li>');
	var notelist = $('#notelist');
	notelist.append(newnote);

	//var lastnote = $('#newnote');
	//newnote.insertBefore(lastnote);
}


// goal later: put focus at end of input