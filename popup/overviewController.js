angular.module('app').controller("OverviewController", function($scope){
    var vm = this;
    vm.title = 'Mirror 	Extension';

    loadMirroredTabs(function(mirroredTabs){
    	vm.mirroredTabs = mirroredTabs;
    	$scope.$apply();
    });
});

function loadMirroredTabs(successFunc){
	
	var tabCouples = chrome.extension.getBackgroundPage().tabCouples;
	
	chrome.tabs.getSelected(null,function(currentTab){
		chrome.tabs.query({}, function(allTabs) {
			var tabInfo = getTabInfoFromTabs(allTabs);
			
			for(tabId in tabCouples){
				if(tabId != currentTab.id){
					continue;
				}
				mirroredTabs = [];
				for(e in tabCouples[tabId])	{
					var coupledTabId = tabCouples[tabId][e];
					mirroredTabs.push(tabInfo[coupledTabId]);
				}
			}
		successFunc(mirroredTabs)
		});
	});
}

function getTabInfoFromTabs(tabs){
	var tabInfo = [];
	for(k in tabs){
		var tab = tabs[k];
		tabInfo[tab.id] = {url:tab.url,title:tab.title};
	}
	return tabInfo;
}
