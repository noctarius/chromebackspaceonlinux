// Saves options to localStorage.
var urls;

function saveOptions() {
  var select = document.getElementById("backspace");
  var activate = select.checked;
  localStorage["activated"] = activate;

  select = document.getElementById("closetab");
  activate = select.checked;
  localStorage["closeOnHistoryTop"] = activate;
  
  select = document.getElementById("pageaction");
  activate = select.checked;
  localStorage["showPageAction"] = activate;

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
  
  localStorage["exceptions"] = JSON.stringify(urls);
}

// Restores select box state to saved value from localStorage.
function restoreOptions() {
  var activate = localStorage["activated"];
  if (activate) {
	  activate = activate == "false" ? false : true;
	  var select = document.getElementById("backspace");
	  select.checked = activate;
  }
  
  activate = localStorage["closeOnHistoryTop"];
  if (activate) {
	  activate = activate == "false" ? false : true;
	  var select = document.getElementById("closetab");
	  select.checked = activate;
  }

  activate = localStorage["showPageAction"];
  if (activate) {
	  activate = activate == "false" ? false : true;
	  var select = document.getElementById("pageaction");
	  select.checked = activate;
  }
  
  urls = localStorage["exceptions"];
  if (urls == "undefined")
  	urls = new Array();
  else
    urls = JSON.parse(urls);
}

function startup() {
	restoreOptions();
	fillExceptionList(urls);
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
