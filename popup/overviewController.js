angular.module('app').controller("OverviewController", function ($scope) {
    const vm = this;
    vm.title = 'Overview';

    loadMirroredTabs(function (mirroredTabs) {
        vm.mirroredTabs = mirroredTabs;
        $scope.$apply();
    });
});

function loadMirroredTabs(successFunc) {

    const couplings = [];

    chrome.tabs.getSelected(null, function (currentTab) {
        chrome.tabs.query({}, function (allTabs) {
            const tabInfo = getTabInfoFromTabs(allTabs);
            const mirroredTabs = [];
            for (let k in couplings) {
                if (!couplings.hasOwnProperty(k)) {
                    continue;
                }

                if (tabId !== currentTab.id) {
                    continue;
                }

                for (let e in couplings[tabId]) {
                    if (!couplings[tabId].hasOwnProperty(e)) {
                        continue;
                    }

                    const coupledTabId = couplings[tabId][e];
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
