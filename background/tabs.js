/*
    This keeps track of all chrome tabs.
    Having an array of all tabs is easy to work with in comparison to
    do a chrome async query and do work in its callback.
 */
let allTabs = {};

function addTab(tab) {
    allTabs[tab.id] = tab;
    sync();
}

function delTab(tabId) {
    delete allTabs[tabId];
    decoupleTabFromGroups(tabId)
}

function onUpdateTab(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        addTab(tab);
    }
}

function onActivateTab(evt) {
    chrome.tabs.get(evt.tabId, function (tab) {
        addTab(tab);
    });
}

const listeners = {
    "onUpdated": onUpdateTab,
    "onActivated": onActivateTab,
    "onRemoved": delTab,
    "onCreated": addTab,
}

function initTabs() {
    chrome.tabs.query({}, (tabs) => {
        for (var k in tabs) {
            if (!tabs.hasOwnProperty(k)) {
                continue;
            }
            addTab(tabs[k]);
        }
    });
}

function addTabEventListeners() {
    for (let eventName in listeners) {
        if (!listeners.hasOwnProperty(eventName)) {
            continue
        }

        const listener = listeners[eventName];
        chrome.tabs[eventName].addListener(listener);
    }
}
