document.onkeydown = BackspaceKeyListener;
document.onkeyup = BackspaceKeyListener;
document.onkeypress = BackspaceKeyListener;

function BackspaceKeyListener(event) {
	var isCtrl = event.ctrlKey;
	var isAlt = event.altKey;
	var isShift = event.shiftKey;
	
	if (!isCtrl && !isAlt) {
		var target = event.target;
		if (event.which == 8 && target) {		
			// If on text fields enable usage
			if (target.type == 'text' ||
					target.type == 'textarea')
				return true;
			
			else
				chrome.extension.sendRequest( { message: "isActivated" }, 
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
	}
	
	return true;
}
