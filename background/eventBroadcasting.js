function receiveEventBroadcastFromContentScript(msg, sender) {
    withActiveTabId((activeTabId) => {
        if (activeTabId === sender.tab.id) {
            broadcastEventToCoupledTabsContentScripts(activeTabId, msg);
        }
    });
}

function broadcastEventToCoupledTabsContentScripts(activeTabId, msg) {
    eachCoupledTabId(activeTabId, (connectedTabId) => {
        chrome.tabs.sendMessage(connectedTabId, msg);
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

function eachCoupledTabId(activeTabId, f) {
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

function initContentScriptEventListener() {
    chrome.extension.onMessage.addListener(receiveEventBroadcastFromContentScript);
}