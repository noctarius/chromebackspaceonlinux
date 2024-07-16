var oldOnKeyDownHandler = null;

var legalTextfieldTypes = [
	"date", "datetime", "datetime-local", "email", "month", "number", "password", 
	"search", "tel", "text", "url", "week", "textarea", "input"
];

async function injectBackspaceHander() {
	if (!document.onkeydown)
		oldOnKeyDownHandler = document.onkeydown;

	if (!isBlacklistedPage()) {
		document.onkeydown = BackspaceKeyListener;

		// Send message to the service worker to test
		// for activated state
		const response = await chrome.runtime.sendMessage( {
			message: {
				command: "isActivated",
				data: location.href
			}
		} );

		if (response.message === true)
			await showPageAction(true);
		else
		await showPageAction(false);
	} else {
		await showPageAction(false);
	}
}

async function showPageAction(ok) {
	return chrome.runtime.sendMessage( {
		message: {
			command: "showPageAction",
			data: ok
		}
	} );
}

function BackspaceKeyListener(event) {
	var isCtrl = event.ctrlKey;
	var isAlt = event.altKey;
	var isShift = event.shiftKey;

	if (!isCtrl && !isAlt) {
		const extractTarget = (event) => {
			if (event.composed) {
				const composedPath = event.composedPath();
				return composedPath[0];
			}
			return event.target;
		}

		const target = extractTarget(event);
		if (event.which === 8 && target) {
			// If on text fields or messagequeue
			// was already triggered disable usage
			if (isLegalTextfield(target)) {
				if (!oldOnKeyDownHandler && typeof(oldOnKeyDownHandler) == 'function')
					return oldOnKeyDownHandler(event);

				return true;

			} else {
				// Mark as already triggered
				window.setTimeout(async () => {
					await UseBackspaceShortcut(isShift);
				}, 0);
				event.preventDefault();
				return false;
			}
		}
	}

	return true;
}

async function UseBackspaceShortcut(isShift) {
	if (window.history.length === 1) {
		return chrome.runtime.sendMessage( {
			message: {
				command: "closeTab"
			}
		} );
	}

	// Send message to background.html to test
	// for activated state
	const response = await chrome.runtime.sendMessage( {
		message: {
			command: "isActivated",
			data: location.href
		}
	} );

	if (response.message === true) {
		if (!isShift)
			window.history.back();
		else
			window.history.forward();
	}
}

function isLegalTextfield(target) {
	if (target.isContentEditable)
		return true;

	if (isLegalInputType(target))
		return true;

	if (target.tagName === 'DIV' &&
		target.className.indexOf("cell-input") > -1) {
		return true;
	}

	if (target.tagName === 'EMBED' &&
		target.name === 'plugin') {
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
			( selection.focusNode.nodeType === 3 && selection.focusNode.parentNode.isContentEditable ))
			return true;
	}

	if (target.ownerDocument.designMode === "on")
		return true;

	if (target.outerHTML.indexOf('class="Mentions_Input" contenteditable="true"') > -1 &&
			target.baseURI.indexOf('http://www.facebook.com/') > -1)
		return true;

	return false;
}

function isLegalInputType(target) {
	for (var i = 0; i < legalTextfieldTypes.length; i++) {
		if (target.type === legalTextfieldTypes[i])
	        return true;
	}
	return false;
}

function isBlacklistedPage() {
	if (location.href.indexOf("docs.google.com") > -1)
		return true;

	if (location.href.indexOf("spreadsheets.google.com") > -1)
		return true;

	return false;
}

// Inject the handler if eligible (careful, async call)
injectBackspaceHander();
