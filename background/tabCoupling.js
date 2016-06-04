/*
	First scratch version
	methods here will find matching coupled tabs for the giveb tabId and tabUrl

	basically the following structure will be build:
	tabCouples[tabId]=[coupledTabsIds...]

	this will help the event broadcaster to find the tabs events musts be sent to

	the config currently is hard coded and should be moved into localStorage managed by popup.js
*/

var tabCouples = [];

var config = [
	{
		url1 : ".*mongos.*",
		url2 : ".*mongos.*"
	},
	{
		url1 : ".*snowtrex\\.de.*",
		url2 : ".*snowtrex\\.de.*"
	}	
];

function findCoupleForTab(tab){
	
	// if tabId is marked to have no couple tabs, abort
	if(isTabBlockedFromDetection(tab)){
		//console.error("url not coupled " + tab.url);
		return null;
	}
	
	if(hasTabCoupledTabs(tab)){
		//console.info("found tabCouples in cache " + tab.id);
		//console.log(tabCouples[tabId]);
		return tabCouples[tab.id];
	}

	blockTabFromDetection(tab);
	
	for(k in config){
		configEntry = config[k];
		if(urlMatch(tab.url, configEntry.url1)){
			findCoupledTabsForTabByUrlRegEx(tab,configEntry.url2);
		}	

		if(urlMatch(tab.url, configEntry.url2)){
			findCoupledTabsForTabByUrlRegEx(tab,configEntry.url1);
		}
	}
	return null;
}

function hasTabCoupledTabs(tab){
	return (typeof tabCouples[tab.id] !== "undefined");
}
function isTabBlockedFromDetection(tab){
	return (tabCouples[tab.id]==0);
}
function blockTabFromDetection(tab){
	tabCouples[tab.id]=0;
}

function findCoupledTabsForTabByUrlRegEx(tab, urlRegEx){
	console.debug("find tabCouples by url " + tab.url +" and regEx "+ urlRegEx);
	 chrome.tabs.query({},function(allTabs) {
	 	var coupledTabs = [];
	 	for(k in allTabs){
	 		var currenTab = allTabs[k];
	 		if(currenTab.id == tab.id){
	 			// do not couple the source tab with itself
	 			continue;
	 		}
	 		if(urlMatch(currenTab.url,urlRegEx)){
	 			coupledTabs.push(currenTab.id);
			}	
	 	}

	 	if(coupledTabs.length>0){
	 		tabCouples[tab.id]=coupledTabs;
	 		console.log("found tabs for url " + tab.url);
	 		console.log(tabCouples)
	 	}else{
	 		console.log("found nothing");
	 	}
	 });
}

function urlMatch(url,urlRegEx){
		var regex = new RegExp(urlRegEx);
		var match = regex.exec(url);
		if(match!=null){
			return true;
		}
		return false;
}

function isTabsIdInArray(tabId,tabIds){
	for(k in tabIds){
		if(tabIds[k]===tabId){
			return true;
		}
	}
	return false;
}
