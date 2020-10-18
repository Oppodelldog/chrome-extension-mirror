/*
    This keeps track of all chrome tabs.
    Having an array of all tabs is easy to work with in comparison to
    do a chrome async query and do work in its callback.
 */
let allTabs = [];

function addTab(tab) {
    allTabs[tab.id] = tab;

    sync();
}

function delTab(tabId) {
    delete allTabs[tabId];
    decoupleTabFromGroups(tabId)
}

function addOnTabUpdatedListener(chrome) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.status === "complete") {
            addTab(tab);
        }
    });
}

function addOnTabActivatedListener(chrome) {
    chrome.tabs.onActivated.addListener(function (evt) {
        chrome.tabs.get(evt.tabId, function (tab) {
            addTab(tab);
        });
    });
}

function addOnTabRemovedListener(chrome) {
    chrome.tabs.onRemoved.addListener(delTab);
}

function addOnTabCreatedListener(chrome) {
    chrome.tabs.onCreated.addListener(addTab);
}

function initTabs(chrome) {
    addOnTabUpdatedListener(chrome);
    addOnTabActivatedListener(chrome);
    addOnTabCreatedListener(chrome);
    addOnTabRemovedListener(chrome);
}
