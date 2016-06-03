/*
	First scratch version
	methods here will find matching coupled tabs for the giveb tabId and tabUrl

	basically the following structure will be build:
	couples[tabId]=[coupledTabsIds...]

	this will help the event broadcaster to find the tabs events musts be sent to

	the config currently is hard coded and should be moved into localStorage managed by popup.js
*/

var couples = [];


var config = [
	{
		url1 : ".*mongos.*",
		url2 : ".*mongos.*"
	}
];

function findCoupleForTab(tabId,tabUrl){
	
	// if tabId is marked to have no couple tabs, abort
	if(couples[tabId]==0){
		//console.error("url not coupled " + tabUrl);
		return null;
	}
	
	if(typeof couples[tabId] !== "undefined"){
		//console.info("found couples in cache " + tabId);
		//console.log(couples[tabId]);
		return couples[tabId];
	}

	// start finding coupled tabs
	// initially set entry for the tabId to 0 and mark it to have no coupled tabs
	couples[tabId]=0;

	
	for(k in config){
		configEntry = config[k];
		if(urlMatch(tabUrl, configEntry.url1)){
			findCouplesTabsForUrlByUrlRegEx(tabId,tabUrl,configEntry.url2);
		}	

		if(urlMatch(tabUrl, configEntry.url2)){
			findCouplesTabsForUrlByUrlRegEx(tabId,tabUrl,configEntry.url1);
		}
	}
	return null;
}

function findCouplesTabsForUrlByUrlRegEx(tabId, url, urlRegEx){
	console.debug("find couples by url " + url +" and regEx "+ urlRegEx);
	 chrome.tabs.query({},function(tabs) {
	 	var coupledTabs = [];
	 	for(k in tabs){
	 		var tab = tabs[k];
	 		if(tab.id == tabId){
	 			// do not couple the source tab with itself
	 			continue;
	 		}
	 		if(urlMatch(tab.url,urlRegEx)){
	 			coupledTabs.push(tab.id);
			}	
	 	}

	 	if(coupledTabs.length>0){
	 		couples[tabId]=coupledTabs;
	 		console.log("found tabs for url " + url);
	 		console.log(couples)
	 	}else{
	 		console.error("found nothing");
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