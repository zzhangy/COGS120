'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	$('.dropdown-menu a').click(getResults);
}

function populateSearch(results_array) {
	var wrapper_div = $('#searchResults');
	if (results_array.length <= 0) {
		document.getElementById('noResults').style.display = 'block';
		wrapper_div.html(' ');
	}
	else {
		document.getElementById('noResults').style.display = 'none';
		var num = results_array.length;
		var i;
		var ul = '<ul>';
		for (i = 0; i < num; ++i) {
			var line = results_array[i];
			//var li = '<li>' + line.note + '</li>';
			if ((i % 2) == 0) {
				var li = '<li class="result-odd">' + '<a href="/edit/' + line.folder 
							+ '/' + line.note + '">'+ line.note + '</a></li>';
			}
			else {
				var li = '<li class="result-even">' + '<a href="/edit/' + line.folder 
							+ '/' + line.note + '">'+ line.note + '</a></li>';
			}
			ul += li;
		}

		ul += '</ul>';
		wrapper_div.html(ul);
	}
}

function getResults(e) {
	e.preventDefault();
	var search_string = $(this).data('color');
	$.get("/search/"+ search_string, populateSearch);
}