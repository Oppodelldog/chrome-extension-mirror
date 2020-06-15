angular.module('app').controller("OverviewController", function ($scope) {
    const vm = this;
    vm.title = 'Overview';

    loadMirroredTabs(function (mirroredTabs) {
        vm.mirroredTabs = mirroredTabs;
        $scope.$apply();
    });
});

function loadMirroredTabs(successFunc) {

    const tabCouples = chrome.extension.getBackgroundPage().tabCouples;

    chrome.tabs.getSelected(null, function (currentTab) {
        chrome.tabs.query({}, function (allTabs) {
            const tabInfo = getTabInfoFromTabs(allTabs);
            const mirroredTabs = [];
            for (let tabId in tabCouples) {
                if (!tabCouples.hasOwnProperty(tabId)) {
                    continue;
                }

                if (tabId !== currentTab.id) {
                    continue;
                }

                for (let e in tabCouples[tabId]) {
                    if (!tabCouples[tabId].hasOwnProperty(e)) {
                        continue;
                    }

                    const coupledTabId = tabCouples[tabId][e];
                    mirroredTabs[coupledTabId] = tabInfo[coupledTabId];
                }
            }
            successFunc(mirroredTabs)
        });
    });
}

function getTabInfoFromTabs(tabs) {
    const tabInfo = [];
    for (let k in tabs) {
        if (!tabs.hasOwnProperty(k)) {
            continue;
        }

        const tab = tabs[k];
        tabInfo[tab.id] = {url: tab.url, title: tab.title};
    }
    return tabInfo;
}
