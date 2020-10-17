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

window.chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    addTab(tab);
    if (changeInfo.status === "complete") {
        refreshCouplesForTabAndItsCouples(tab);
    }
});

window.chrome.tabs.onActivated.addListener(function (evt) {
    chrome.tabs.get(evt.tabId, function (tab) {
        addTab(tab);
        refreshCouplesForTabAndItsCouples(tab);
    });
});


window.chrome.tabs.onCreated.addListener(addTab);
window.chrome.tabs.onRemoved.addListener(delTab);