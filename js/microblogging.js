// Global namespace
var HummingBird = HummingBird || {};

/**
 * Manage all related to storage things in the localStorage
 * database.
 */
HummingBird.storage = function() {
	/*
	 * Private methods and variables.
	 */
	var listLogs = [];

	/*
	 * Public methods.
	 */
	return { 
		saveLog: function(content) {
			// Log object
			var timestamp = new Date().getTime();

			var log = {
				"id": timestamp,
				"content": content,
				"date": (new Date()).toString()
			}

			listLogs.push(log);

			// Write logs in localStorage
			localStorage.setItem("listLogs", JSON.stringify(listLogs));
		},
		loadLogs: function() {
			listLogs = eval(localStorage.getItem("listLogs"));
			listLogs = listLogs || [];
			this.printAllLogs();
		},
		removeLog: function(id) {
			for (var i = 0; i < listLogs.length; i++) {
				if (listLogs[i].id == id) {
					listLogs.splice(i, 1);
				}
			}

			localStorage.setItem("listLogs", JSON.stringify(listLogs));
		},
		dropAllLogs: function() {
			listLogs = [];
			localStorage.setItem("listLogs", "[]");
		},
		printAllLogs: function() {
			// Clears the div.log-container.
			$(".log-container").html("");

			$.each(listLogs, function(index, value) {
				var date = new Date(value.date);
				var dateJSON = HummingBird.utils.getDateJSONObject(date);
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
				linkContent.html("<i>" + dateString + "</i> - " + value.content + " --");
				linkContent.attr("class", "list-group-item");
				linkContent.append(deleteButton);

				$(".log-container").append(linkContent);
			});
		}
	};
}();

/**
 * Manage all the utils.
 */
HummingBird.utils = function() {
	/*
	 * Private methods and variables.
	 */
	function clockFormat(n) {
		return n = n < 10 ? "0" + n : n;
	}

	return {
		/*
		 * Gets a JSON object with the date formated passing only
		 * the date in string format.
		 */
		getDateJSONObject: function(date) {
			var day = clockFormat(date.getDate());
			var month = clockFormat(date.getMonth());
			var year = clockFormat(date.getYear() + 1900);

			var hours = clockFormat(date.getHours());
			var minutes = clockFormat(date.getMinutes());
			var seconds = clockFormat(date.getSeconds());

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
	};
}();

/**
 * Manage all the ui events.
 */
HummingBird.events = function() {
	/*
	 * Private methods and variables.
	 */
	function eventList() {
		$(".save-chirp").click(function() {
			var content = $("#inputContent").val();

			if (content) {
				HummingBird.storage.saveLog(content);
				$("#inputContent").val("");
			}

			HummingBird.storage.printAllLogs();
			HummingBird.events.initialSetup();
		});

		$(".drop-all-log").click(function() {
			HummingBird.storage.dropAllLogs();
			HummingBird.storage.printAllLogs();
		});

		$(".delete-button").click(function() {
			var id = $(this).attr("id");
			HummingBird.storage.removeLog(id);
			HummingBird.events.initialSetup();
		});
	}

	/*
	 * Public methods.
	 */
	return {
		initialSetup: function() {
			HummingBird.storage.loadLogs();
			eventList();
		}
	};
}();

$(document).ready(function() {
	HummingBird.events.initialSetup();
});
