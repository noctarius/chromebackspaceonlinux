var oldOnKeyDownHandler = null;

if (!document.onkeydown)
	oldOnKeyDownHandler = document.onkeydown;

if (!isBlacklistedPage())
	document.onkeydown = BackspaceKeyListener;

function BackspaceKeyListener(event) {
	var isCtrl = event.ctrlKey;
	var isAlt = event.altKey;
	var isShift = event.shiftKey;
	
	if (!isCtrl && !isAlt) {
		var target = event.target;
		if (event.which == 8 && target) {		
			// If on text fields or messagequeue
			// was already triggered disable usage
			if (isLegalTextfield(target)) {
				if (!oldOnKeyDownHandler)
					return oldOnKeyDownHandler(events);
					
				return true;
			
			} else {
				// Mark as already triggered
				window.setTimeout("UseBackspaceShortcut(" + isShift + ")", 0);
				return false;
			}
		}
	}
	
	return true;
}

function UseBackspaceShortcut(isShift) {
	if (window.history.length == 1) {
		chrome.extension.sendRequest( {
			message: JSON.stringify( { 
				command: "closeTab"
			} )
		} );
		
		return;
	}

	// Send message to background.html to test
	// for activated state
	chrome.extension.sendRequest( {
		message: JSON.stringify( { 
			command: "isActivated", 
			data: location.href 
		} )
	}, function(response) {
		console.log(response.message);
		if (response.message == true)
			if (!isShift)
				window.history.back();
			else
				window.history.forward();
		}
	);
}

function isLegalTextfield(target) {
	if (target.type == 'text')
		return true;
		
	if (target.type == 'textarea')
		return true;
		
	if (target.type == 'password')
		return true;
		
	if (target.outerHTML.indexOf('class="Mentions_Input" contenteditable="true"') > -1 &&
			target.baseURI.indexOf('http://www.facebook.com/') > -1)
		return true;
		
	return false;
}

function isBlacklistedPage() {
	if (location.href.indexOf("http://docs.google.com") > -1)
		return true;

	return false;
}

