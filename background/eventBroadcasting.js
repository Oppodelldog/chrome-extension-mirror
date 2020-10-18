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
            chrome.tabs.sendMessage(connectedTab.id, msg);
        });
    });
}

function withActiveTab(f) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            f(activeTab);
        }
    });
}

function eachConnectedTab(activeTab, f) {
    if (!coupler.hasTabCoupledTabs(activeTab.id)) {
        return
    }

    const coupledTabs = coupler.getCoupledTabs(activeTab.id)

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
}
