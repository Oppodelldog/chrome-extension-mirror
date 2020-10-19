function receiveEventBroadcastFromContentScript(request, sender, sendResponse) {
    withActiveTabId((activeTabId) => {
        if (activeTabId === sender.tab.id) {
            broadcastEventToCoupledTabsContentScripts(request);
        }
    });
}

chrome.extension.onMessage.addListener(receiveEventBroadcastFromContentScript);

function broadcastEventToCoupledTabsContentScripts(msg) {
    withActiveTabId((activeTabId) => {
        eachConnectedTabId(activeTabId, (connectedTabId) => {
            chrome.tabs.sendMessage(connectedTabId, msg);
        });
    });
}

function withActiveTabId(f) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            f(activeTab.id);
        }
    });
}

function eachConnectedTabId(activeTabId, f) {
    if (!coupler.hasTabCoupledTabs(activeTabId)) {
        return
    }

    const coupledTabs = coupler.getCoupledTabs(activeTabId)

    for (let k in coupledTabs) {
        if (!coupledTabs.hasOwnProperty(k)) {
            continue;
        }

        const tabId = coupledTabs[k];
        if (tabId !== activeTabId) {
            f(tabId)
        }
    }
}
