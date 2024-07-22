chrome.runtime.onInstalled.addListener( ( {reason} ) => {
    if (reason !== "install")
        return;

    chrome.runtime.openOptionsPage();
    console.log("config-tab opened");
} );

async function showPageAction(tab, csMessage) {
	const activate = await isShowPageActionEnabled();
	
	if (!activate || activate != "true")
		return;

	const path = "enabled.png";
	const title = "Backspace Key-Binding enabled";
	if (csMessage.data === false) {
		path = "disabled.png";
		title = "Backspace Key-Binding disabled";
	}

	await chrome.action.setIcon( {
		"tabId": tab.id,
		"path": path
	} );

	await chrome.action.setTitle( {
		"tabId": tab.id,
		"title": title
	} );
}

async function isActivated(csMessage) {
	const activate = await isExtensionActivated();
	if (!activate)
		return false;

	const exceptions = await getExceptions();
	if (exceptions === undefined)
		return activate === true;
		  
    const urls = JSON.parse(exceptions);
    for (let i = 0; i < urls.length; i++) {
        const regex = new RegExp(".*" + urls[i] + ".*");
    
        if (csMessage.match(regex))
            return false;
    }

	return activate === true;
}

async function closeTab(tab, csMessage) {
	// is extension activated?
	if (!await isActivated(csMessage))
		return;
		
	// is option activated?
	const activate = await isCloseOnHistoryTopEnabled();
	if (!activate ||
			activate !== true)
		return;	
	
    const storage = await getSessionStorage();
    const tabHistory = storage["tabHistory"];
    if (!tabHistory)
        return;

    const data = tabHistory[tab.windowId];
	if (data) {
		const oldTabId = data[1];
		chrome.tabs.remove(tab.id, function(){
			console.log("Tab closed");
			
			if (oldTabId === null)
				return;
			
			chrome.tabs.update(oldTabId, {
				selected: true
			}, function(tab){
				console.log("Switched back to last previously selected tab");
			});
		});
	}
}

chrome.tabs.onActivated.addListener( async (activeInfo) => {
    const storage = (await chrome.storage.session.get()) || {};
    const tabHistory = storage["tabHistory"] || {};
    const data = tabHistory[activeInfo.windowId] || new Array(3);

    data[2] = data[1];
    data[1] = data[0];
    data[0] = activeInfo.tabId;
    
    tabHistory[activeInfo.windowId] = data;
    console.log(activeInfo.windowId + ": " + data);

    storage["tabHistory"] = tabHistory;
    await chrome.storage.session.set(storage);
} );

chrome.tabs.onRemoved.addListener(
    async (tabId, removeInfo) => {
        const storage = (await chrome.storage.session.get()) || {};
        const tabHistory = storage["tabHistory"];

        if (!tabHistory)
            return;

        const data = tabHistory[removeInfo.windowId];
        if (!data)
            return;

		for (let i = 0; i < tabHistory.length; i++) {
			const tabs = tabHistory[i];
			if (!tabs)
                continue;
			
			for (let o = 0; o < tabs.length; o++) {
				if (o > 0 && o < tabHistory.length - 1) {
					tabs[o - 1] = tabs[o];
				} else if (o === tabHistory.length - 1) {
					tabs[o] = null;
				}
			}
		}
    }
);

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
		console.log(sender.tab ?
            "from a content script:" + sender.tab.url + " ==> " + JSON.stringify(request) :
            "from the extension"
        );
            
        const csMessage = request.message;
        if (!csMessage)
            sendResponse( { message: false } );
        
        if (csMessage.command == "isActivated") {
            setTimeout( async () => sendResponse( { message: await isActivated(csMessage.data) } ), 1 );
            return true;
        }
            
        if (csMessage.command == "closeTab")
            closeTab(sender.tab, csMessage);

        if (csMessage.command == "showPageAction")
            showPageAction(sender.tab, csMessage);
    }
)

async function getOptionsStorage() {
    return (await chrome.storage.sync.get()) || {};
}

async function getSessionStorage() {
    return (await chrome.storage.session.get()) || {};
}

async function setSessionStorage(content) {
    return chrome.storage.session.set(content);
}

async function getExceptions() {
    const storage = await getOptionsStorage();
    return storage["exceptions"];
}

async function isShowPageActionEnabled() {
    const storage = await getOptionsStorage();
    return storage["showPageAction"] || true;
}

async function isExtensionActivated() {
    const storage = await getOptionsStorage();
    return storage["activated"] || true;
}

async function isCloseOnHistoryTopEnabled() {
    const storage = await getOptionsStorage();
    return storage["closeOnHistoryTop"] || false;
}
