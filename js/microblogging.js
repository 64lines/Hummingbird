/** Models **/
var listLogs = [];

function saveLog( content ) {
	// Log object
	var timestamp = new Date().getTime();

	var log = {
		"id": timestamp,
		"content": content,
		"date": ( new Date() ).toString()
	}

	listLogs.push(log);

	// Write logs in localStorage
	localStorage.setItem( "listLogs", JSON.stringify( listLogs ) );
}

function loadLogs() {
	listLogs = eval( localStorage.getItem( "listLogs" ) );
	listLogs = listLogs || [];
	printAllLogs();
}

//---------------------[ TODO: This code needs a refactor ]------------------
function clockFormat(n) {
	return n = n < 10 ? "0" + n : n;
}

function deleteElement(id) {
	for (var i = 0; i < listLogs.length; i++) {
		if (listLogs[i].id == id) {
			listLogs.splice(i, 1);
		}
	}

	localStorage.setItem( "listLogs", JSON.stringify( listLogs ) );
}

/*
 * Gets a JSON object with the date formated passing only
 * the date in string format.
 */
function getDateJSONObject(date) {
	var day = clockFormat( date.getDate() );
	var month = clockFormat( date.getMonth() );
	var year = clockFormat( date.getYear() + 1900 );

	var hours = clockFormat( date.getHours() );
	var minutes = clockFormat( date.getMinutes() );
	var seconds = clockFormat( date.getSeconds() );

	// Parsing numbers to zero-zero-like format.
	return {
		"day": day,
		"month": month,
		"year": year,
		"hours": hours,
		"minutes": minutes,
		"seconds": seconds
	}
}
//---------------------------------------------------------------------------

function printAllLogs() {
	// Clears the div.log-container.
	$(".log-container").html("");
	$.each(listLogs, function( index, value ) {
		var date = new Date( value.date );
		var dateJSON = getDateJSONObject( date );
		var dateString = dateJSON.year +
			"-" + dateJSON.month +
			"-" + dateJSON.day +
			" " + dateJSON.hours +
			":" + dateJSON.minutes +
			":" + dateJSON.seconds;

		var deleteButton = $("<a/>");
		deleteButton.attr("class", "delete-button");
		deleteButton.attr("id", value.id);
		deleteButton.html("<i class='glyphicon glyphicon-trash'></i>");

		// Content's log
		var linkContent = $("<a/>");
		linkContent.attr("href", "#");
		linkContent.html( "<i>" + dateString + "</i> - " + value.content + " --");
		linkContent.attr("class", "list-group-item");
		linkContent.append(deleteButton);

		$(".log-container").append(linkContent);

	});
}

function dropAllLogs() {
	listLogs = [];
	localStorage.setItem( "listLogs", "[]" );
}

function eventList() {
	$(".save-chirp").click(function() {
		var content = $("#inputContent").val();

		if ( content ) {
			saveLog( content );
			$("#inputContent").val( "" );
		}

		printAllLogs();
		initialSetup();
	});

	$(".drop-all-log").click(function() {
		dropAllLogs();
		printAllLogs();
	});

	$(".delete-button").click(function() {
		var id = $(this).attr("id");
		deleteElement(id);
		initialSetup();
	});
}

function initialSetup() {
	loadLogs();
	eventList();
}

$(document).ready(function() {
	initialSetup();
});
