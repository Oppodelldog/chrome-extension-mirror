/*
    This keeps track of all chrome tabs.
    Having an array of all tabs is easy to work with in comparison to
    do a chrome async query and do work in its callback.
 */
let allTabs = [];

function addTab(tab) {
    allTabs[tab.id] = tab;
}

function delTab(tab) {
    delete allTabs[tab.id];
}

function initTabs(chrome) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        addTab(tab);
        if (changeInfo.status === "complete") {
            removeCouplesForTabAndItsCouples(tab);
        }
    });

    chrome.tabs.onActivated.addListener(function (evt) {
        chrome.tabs.get(evt.tabId, function (tab) {
            addTab(tab);
            removeCouplesForTabAndItsCouples(tab);
        });
    });


    chrome.tabs.onCreated.addListener(addTab);
    chrome.tabs.onRemoved.addListener(delTab);
}