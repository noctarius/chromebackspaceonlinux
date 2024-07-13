// Saves options to localStorage.
let urls;

async function saveOptions() {
	const getCheckboxValue = (name) => {
		const checkbox = document.getElementById(name);
		if (!checkbox)
			return false;
		return checkbox.checked;
	}

	const storage = await getOptionsStorage();
	storage["activated"] = getCheckboxValue("backspace");
	storage["closeOnHistoryTop"] = getCheckboxValue("closetab");
	storage["showPageAction"] = getCheckboxValue("pageaction");
	storage["exceptions"] = JSON.stringify(urls);
	await setOptionsStorage(storage);

	// Update status to let user know options were saved.
	const status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

// Restores select box state to saved value from storage.
async function restoreOptions() {
	const storage = await getOptionsStorage();
	let activate = storage["activated"];
	if (activate) {
		activate = activate == "false" ? false : true;
		const select = document.getElementById("backspace");
		select.checked = activate;
	}

	activate = storage["closeOnHistoryTop"];
	if (activate) {
		activate = activate == "false" ? false : true;
		const select = document.getElementById("closetab");
		select.checked = activate;
	}

	activate = storage["showPageAction"];
	if (activate) {
		activate = activate == "false" ? false : true;
		const select = document.getElementById("pageaction");
		select.checked = activate;
	}

	urls = storage["exceptions"];
	if (!urls || urls == "undefined")
		urls = new Array();
	else
		urls = JSON.parse(urls);
}

async function startup() {
	await restoreOptions();
	fillExceptionList(urls);

	// Register checkbox click handlers
	var checkboxes = document.querySelectorAll('input[type=checkbox]');
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].addEventListener("click", saveOptions)
	}

	// Register exception remove button click handler
	document.getElementById('exceptionRemove').addEventListener("click", function() {
		removeFromExceptionList();
		saveOptions();
	});

	// Register exception add button click handler
	document.getElementById('exceptionAdd').addEventListener("click", function() {
		addException();
		saveOptions();
	});

	document.getElementById('urls').addEventListener("click", function(el) {
		checkExceptionList(el);
	});
}

function addException() {
	var el = document.getElementById("url");
	if (!el) return;
	
	var value = el.value;
	if (!value) return;
	
	if (!urls) urls = new Array();
	
	for (var i = 0; i < urls.length; i++) {
		if (urls[i] == value) return;
	}
	
	urls.push(value);
	urls.sort();
	fillExceptionList(urls);
}

function fillExceptionList(options) {
	var el = document.getElementById("urls");
	if (!el) return;

	clearList(el);

	for (var i = 0; i < options.length; i++) {
		var option = document.createElement("option");
		option.appendChild(document.createTextNode(options[i]));
		el.appendChild(option);
	}
}

function clearList(list) {
	if (!list) return;
	
	var childs = list.childNodes;
	if (!childs) return;
	
	var length = childs.length;
	for (var i = 0; i < length; i++) {
		var child = childs[0];
		list.removeChild(child);
	}
}

function checkExceptionList(list) {
	var index = list.selectedIndex;
	var button = document.getElementById("exceptionRemove");
	if (index == -1) {
		button.disabled=true;
	} else {
		button.disabled=false;
	}		
}

function removeFromExceptionList() {
	var list = document.getElementById("urls");
	if (!list) return;
	
	var index = list.selectedIndex;
	if (index == -1) return;

	if (!urls) urls = new Array();

	var temp = new Array();
	for (var i = 0; i < urls.length; i++) {
		if (i == index) continue;
		
		temp.push(urls[i]);
	}
	
	urls = temp;
	urls.sort();
	fillExceptionList(urls);	
}

async function getOptionsStorage() {
    return (await chrome.storage.sync.get()) || {};
}

async function setOptionsStorage(content) {
    return chrome.storage.sync.get(content);
}

document.addEventListener('DOMContentLoaded', startup);
