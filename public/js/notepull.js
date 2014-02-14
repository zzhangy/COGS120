'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	//$('#login').click(processLogin);
	//alert(users);
	$('#loginButton').click(processLogin);
}

function processLogin(e) {
	e.preventDefault();
	var email = $('#emailField').val();
	var password = $('#passwordField').val();
	$.get("/checkLogin" + "?email=" + email + "&password=" + password, validateLogin);
}

var tryAgain1 = false;

function validateLogin(json) {
	console.log(json);

	if (json.isUser)
	{
		window.location.href = "home.html";
	}
	else {
		// add error styles!
		if (!tryAgain1)
		$('#emailField').before('<h5 style="color:red">Please try again</h5>');
		tryAgain1 = true;
	}
}