document.onkeydown = BackspaceKeyListener;
wasActivatedBefore = false;

function BackspaceKeyListener(event) {
	var isCtrl = event.ctrlKey;
	var isAlt = event.altKey;
	var isShift = event.shiftKey;
	
	if (!isCtrl && !isAlt) {
		var target = event.target;
		if (event.which == 8 && target) {		
			// If on text fields or messagequeue
			// was already triggered disable usage
			if (target.type == 'text' ||
					target.type == 'textarea') {
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
	// Send message to background.html to test
	// for activated state
	chrome.extension.sendRequest( 
		{ message: JSON.stringify( { command: "isActivated", data: location.href } ) }, 
		function(response) {
			console.log(response.message);
			if (response.message == true)
				if (!isShift)
					window.history.back();
				else
					window.history.forward();
		}
	);
}

