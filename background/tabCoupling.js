/*
	First scratch version
	methods here will find matching coupled tabs for the giveb tabId and tabUrl

	basically the following structure will be build:
	tabCouples[tabId]=[coupledTabsIds...]

	this will help the event broadcaster to find the tabs events musts be sent to

	the config currently is hard coded and should be moved into localStorage managed by popup.js
*/
var tabCouples = [];
/*
localStorage["coupling"] = JSON.stringify([
	{
		groupName :"Mongo",
		regExList :[ {regEx:".*mongos.*"} ]
	},
	{
		groupName:"Google",
		regExList :[ {regEx:".*google\\.de.*"} ,{regEx:".*google\\.fr.*"}, {regEx:".*google\\.ch.*"}]
	}	
]);*/

function findCouplesForTab(tab){
	
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
	var config = JSON.parse(loadConfiguration());
	for(k in config){
		configEntry = config[k];

		for(r in configEntry.regExList){
			var regEx = configEntry.regExList[r];
		
			if(urlMatchRegEx(tab.url, regEx)){
				findCoupledTabsForTabByUrlRegExList(tab,configEntry.regExList);
			}	
		}
	}
	return null;
}

function findCoupledTabsForTabByUrlRegExList(tab,regExList){
	for(k in regExList){
		var regEx = regExList[k];
		findCoupledTabsForTabByUrlRegEx(tab,regEx);
	}
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

function removeCouplesForTab(tab){
	delete tabCouples[tab.id];
}

function addCouplesForTab(tab,couples){
	if(typeof tabCouples[tab.id] !== "undefined"){
		if(isTabBlockedFromDetection(tab)){
			tabCouples[tab.id]=[];
		}
		for(k in couples){
			tabCouples[tab.id].push(couples[k]);
		}
	}else{
		tabCouples[tab.id]=couples;
	}
}

function findCoupledTabsForTabByUrlRegEx(tab, urlRegEx){
	console.debug("find tabCouples by url " + tab.url +" and regEx "+ urlRegEx);
	 chrome.tabs.query({},function(allTabs) {
	 	
	 	var coupledTabs = getMatchingTabsByUrlRegEx(allTabs,urlRegEx);
		coupledTabs = removeTabIdFromCouples(tab,coupledTabs)

	 	if(coupledTabs.length>0){
	 		addCouplesForTab(tab,coupledTabs);
	 		console.log("found tabs for url " + tab.url);
	 		console.log(tabCouples)
	 	}else{
	 		console.log("found nothing");
	 	}
	 });
}
function removeTabIdFromCouples(tab,couples){
	for(k in couples){
		if(couples[k]==tab.id){
			couples.splice(k,1);
		}
 	}
 	return couples;
}
function getMatchingTabsByUrlRegEx(tabs, urlRegEx){
	var matchingTabs = [];
 	for(k in tabs){
 		var tab = tabs[k];
 		if(urlMatchRegEx(tab.url,urlRegEx)){
 			matchingTabs.push(tab.id);
		}	
 	}	
 	return matchingTabs;
}

function urlMatchRegEx(url,urlRegEx){
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
