document.onkeydown = BackspaceKeyListener;
document.onkeyup = BackspaceKeyListener;
document.onkeypress = BackspaceKeyListener;
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
					target.type == 'textarea' ||
					wasActivatedBefore) {
				return true;
			
			} else {
				// Mark as already triggered
				wasActivatedBefore = true;
				// Send message to background.html to test
				// for activated state
				chrome.extension.sendRequest( { message: "isActivated" }, 
					function(response) {
						console.log(response.message);
						if (response.message == true) {
							if (!isShift)
								window.history.back();
							else
								window.history.forward();
						} else {
							// If extension isn't activated 
							// just reset the trigger
							wasActivatedBefore = true;
						}
					}
				);
				
				return false;
			}
		}
	}
	
	return true;
}
