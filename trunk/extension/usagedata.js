var timeZoneOffset = (new Date().getTimezoneOffset() / 60) * (-1);

function runUsageCollection() {
	var reportedData = new Array();

	// if usage collector is activated
	if (!isUsageCollectionActivated())
		return;

	// report all unsended usage data
	var timeId = getTimeId();
	var length = localStorage.length;
	for ( var i = 0; i < length; i++) {
		var key = localStorage.key(i);

		if (!key.match(/usage_.*/))
			continue;
		if (key == "usage_" + timeId)
			continue;

		var clicks = localStorage[key];
		sendUsageData(key.substring(6), clicks);
		reportedData.push(key);
	}

	// deleted all already reported data
	length = reportedData.length;
	for ( var i = 0; i < length; i++)
		localStorage.removeItem(reportedData[i]);
}

function sendUsageData(timeid, clickCount) {
	var date = new Date();

	var data = {
		timeId : timeid,
		week : date.getWeek(),
		year : date.getFullYear(),
		clicks : clickCount
	};

	data = JSON.stringify(data);

	var url = "http://www.castellcore.org/chromebackspaceonlinux/usage/";
	var http = new XMLHttpRequest();
	http.open("POST", url + timeId, true);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("Content-length", data.length);
	http.setRequestHeader("Connection", "close");
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200)
			console.log(http.responseText);
	};
	http.send(data);
}

function addUsage() {
	// if usage collector is activated
	if (!isUsageCollectionActivated())
		return;

	var clicks = localStorage["usage_" + getTimeId()];
	if (clicks == "undefined" || clicks == "NaN")
		clicks = 1;
	else
		clicks++;

	localStorage["usage_" + getTimeId()] = clicks;
}

function getTimeId() {
	var date = new Date();
	date.setMinutes(0, 0, 0);

	return date.getTime() + "#" + timeZoneOffset;
}

function isUsageCollectionActivated() {
	var usage = localStorage["usage"];
	console.log(usage);
	if (usage == "undefined")
		return false;

	return (usage == "false" ? false : true);

}

function activateScheduler() {
	if (!isUsageCollectionActivated())
		return false;

	// run the usage collection now
	runUsageCollection();

	// start the hourly scheduler
	// window.setInterval("runUsageCollection()", 3600000);
	window.setInterval("runUsageCollection()", 3600);

	return true;
}

function deactivateScheduler() {
	window.clearInterval();
	return true;
}
