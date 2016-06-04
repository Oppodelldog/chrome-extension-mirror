/*
	First scratch version to test capabilities and access to data

	this script displays the tabs that are controlled by the current tab.
*/
window.onload = function() {

	var tabCouples = chrome.extension.getBackgroundPage().tabCouples;
	content = document.getElementById("content");
	
	chrome.tabs.getSelected(null,function(currentTab){
		chrome.tabs.query({}, function(allTabs) {
			var tabHTML = "";
			var tabInfo = getTabInfoFromTabs(allTabs);
			
			for(tabId in tabCouples){
				if(tabId != currentTab.id){
					continue;
				}
				tabHTML += "this tab mirrors to the following tabs:<br><ul>";
				for(e in tabCouples[tabId])	{
					var coupledTabId = tabCouples[tabId][e];
					tabHTML += "<li>" + tabInfo[coupledTabId].title + "</li>";
				}
				tabHTML +="</ul>";
			}

		content.innerHTML = tabHTML;
		});
	});

};

function getTabInfoFromTabs(tabs){
	var tabInfo = [];
	for(k in tabs){
		var tab = tabs[k];
		tabInfo[tab.id] = {url:tab.url,title:tab.title};
	}
	return tabInfo;
}
