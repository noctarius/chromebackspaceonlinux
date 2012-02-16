var oldOnKeyDownHandler = null;

if (!document.onkeydown)
	oldOnKeyDownHandler = document.onkeydown;

if (!isBlacklistedPage()) {
	document.onkeydown = BackspaceKeyListener;

	// Send message to background.html to test
	// for activated state
	chrome.extension.sendRequest( {
		message: JSON.stringify( { 
			command: "isActivated", 
			data: location.href 
		} )
	}, function(response) {
		if (response.message == true)
			showPageAction(true);
		else
			showPageAction(false);
	} );
} else {
	showPageAction(false);
}

function showPageAction(ok) {
	chrome.extension.sendRequest( {
		message: JSON.stringify( { 
			command: "showPageAction", 
			data: ok 
		} )
	} );
}

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
				if (!oldOnKeyDownHandler && typeof(oldOnKeyDownHandler) == 'function')
					return oldOnKeyDownHandler(event);
					
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
		
	if (target.type == 'search')
		return true;
		
	if (target.type == 'email')
		return true;
	
	if (target.tagName == 'DIV' &&
		target.className.indexOf("cell-input") > -1) {
		return true;
	}

	if (location.href.indexOf("sites.google.com") > -1) {
		var body = document.body;
		if (body != null &&
			body.className.indexOf("sites-edit-in-progress") > -1)
			return true;
	}

	var selection = window.getSelection();
	if (selection.focusNode) {
		if ( ( selection.focusNode.nodeType != 3 && selection.focusNode.isContentEditable ) ||
			( selection.focusNode.nodeType == 3 && selection.focusNode.parentNode.isContentEditable ))
			return true;
	}

	if (target.ownerDocument.designMode == "on")
		return true;

	if (target.outerHTML.indexOf('class="Mentions_Input" contenteditable="true"') > -1 &&
			target.baseURI.indexOf('http://www.facebook.com/') > -1)
		return true;
		
	return false;
}

function isBlacklistedPage() {
	if (isSystemWindows())
		return true;

	if (location.href.indexOf("docs.google.com") > -1)
		return true;

	if (location.href.indexOf("spreadsheets.google.com") > -1)
		return true;

	return false;
}

function isSystemWindows() {
	var userAgent = navigator.userAgent;
	if (userAgent.indexOf("Windows") != -1)
		return true;
	else
		return false;
}
