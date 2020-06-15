function receiveEventBroadcastFromContentScript(request, sender, sendResponse) {
    withActiveTab((activeTab) => {
        if (activeTab.id === sender.tab.id) {
            broadcastEventToCoupledTabsContentScripts(request);
        }
    });
}

chrome.extension.onMessage.addListener(receiveEventBroadcastFromContentScript);

function broadcastEventToCoupledTabsContentScripts(msg) {
    withActiveTab((activeTab) => {
        eachConnectedTab(activeTab, (connectedTab) => {
            chrome.tabs.sendMessage(connectedTab.id, msg, function (response) {
                //console.info("response: " + response);
            });
        });
    });
}

function withActiveTab(f) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        f(tabs[0])
    });
}

function eachConnectedTab(activeTab, f) {
    const coupledTabs = findCouplesForTab(activeTab);
    chrome.tabs.query({}, function (allTabs) {
        for (let k in allTabs) {
            if (!allTabs.hasOwnProperty(k)) {
                continue;
            }

            const tab = allTabs[k];
            if (tab.id !== activeTab.id) {
                if (isTabsIdInArray(tab.id, coupledTabs)) {
                    f(tab)
                }
            }
        }
    })
}
