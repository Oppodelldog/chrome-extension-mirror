function receiveEventBroadcastFromContentScript(request, sender, sendResponse) {
    chrome.tabs.getSelected(null, function (currentTab) {
        if (currentTab.id === sender.tab.id) {
            broadcastEventToCoupledTabsContentScripts(request);
        }
    })
}

chrome.extension.onMessage.addListener(receiveEventBroadcastFromContentScript);

function broadcastEventToCoupledTabsContentScripts(msg) {

    chrome.tabs.getSelected(null, function (currentTab) {
        const coupledTabs = findCouplesForTab(currentTab);
        chrome.tabs.query({}, function (allTabs) {
            for (let k in allTabs) {
                if (!allTabs.hasOwnProperty(k)) {
                    continue;
                }

                const tab = allTabs[k];
                if (tab.id !== currentTab.id) {
                    if (isTabsIdInArray(tab.id, coupledTabs)) {
                        chrome.tabs.sendMessage(tab.id, msg, function (response) {
                            //console.info("response: " + response);
                        });
                    }
                }
            }
        });
    });
}
