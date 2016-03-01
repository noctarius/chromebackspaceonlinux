var tabStore = new Array();
var firstStart = localStorage["installed"];

if (!firstStart ||
		firstStart != "true") {
	chrome.tabs.create( { url: "options.html" }, function(tab) {
		localStorage["installed"] = "true";
		console.log("config-tab opened");
	} );
}

chrome.tabs.onSelectionChanged.addListener(
	function(tabId, selectInfo) {
		var data = tabStore[selectInfo.windowId];
		if (!data)
			data = new Array(3);
		
		data[2] = data[1];
		data[1] = data[0];
		data[0] = tabId;
		
		tabStore[selectInfo.windowId] = data;
		console.log(selectInfo.windowId + ": " + data);
	}
);

chrome.tabs.onRemoved.addListener(
	function(tabId) {
		for (var i = 0; i < tabStore.length; i++) {
			var tabs = tabStore[i];
			if (!tabs) continue;
			
			for (var o = 0; o < tabs.length; o++) {
				if (o > 0 && o < tabStore.length - 1) {
					tabs[o - 1] = tabs[o];
				} else if (o == tabStore.length - 1) {
					tabs[o] = null;
				}
			}
		}
	}
);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");
		
		var csMessage = request.message;
		if (!csMessage)
			sendResponse( { message: false } );
		
		if (csMessage.command == "isActivated")
			sendResponse( { message: isActivated(csMessage.data) } );
			
		if (csMessage.command == "closeTab")
			closeTab(sender.tab, csMessage);

		if (csMessage.command == "showPageAction")
			showPageAction(sender.tab, csMessage);
	}
);

function showPageAction(tab, csMessage) {
	var activate = localStorage["showPageAction"];
	
	if (!activate || activate != "true")
		return;

	var path = "enabled.png";
	var title = "Backspace Key-Binding enabled";
	if (csMessage.data == false) {
		path = "disabled.png";
		title = "Backspace Key-Binding disabled";
	}

	chrome.pageAction.setIcon( {
		"tabId": tab.id,
		"path": path
	} );

	chrome.pageAction.setTitle( {
		"tabId": tab.id,
		"title": title
	} );

	chrome.pageAction.show(tab.id);
}

function isActivated(csMessage) {
	var activate = localStorage["activated"];
	if (!activate)
		return false;

	urls = localStorage["exceptions"];
	if (urls == "undefined")
		return activate == "true";
		  
		urls = JSON.parse(urls);

		for (var i = 0; i < urls.length; i++) {
			var regex = new RegExp(".*" + urls[i] + ".*");
		
			if (csMessage.match(regex))
				return false;
		}

	return activate == "true";
}

function closeTab(tab, csMessage) {
	// is extension activated?
	if (!isActivated(csMessage))
		return;
		
	// is option activated?
	var activate = localStorage["closeOnHistoryTop"];
	if (!activate ||
			activate != "true")
		return;	
	
	var data = tabStore[tab.windowId];
	if (data) {
		var oldTabId = data[1];
		chrome.tabs.remove(tab.id, function(){
			console.log("Tab closed");
			
			if (oldTabId == null)
				return;
			
			chrome.tabs.update(oldTabId, {
				selected: true
			}, function(tab){
				console.log("Switched back to last previously selected tab");
			});
		});
	}
}
