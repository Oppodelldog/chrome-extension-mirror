function receiveEventBroadcastFromContentScript(request, sender, sendResponse) {
	chrome.tabs.getSelected(null,function(currentTab){
    	if(currentTab.id == sender.tab.id){
    		//console.info("passthrough " + request.event + " on path:\n " + request.elementPath);
    		broadcastEventToCoupledTabsContentScripts(request);
    	}
    	else{
    		//console.info("don't route from self events");
    	}
	})
}
chrome.extension.onMessage.addListener(receiveEventBroadcastFromContentScript);

function broadcastEventToCoupledTabsContentScripts(msg) {

	chrome.tabs.getSelected(null,function(currentTab){
		var coupledTabs = findCouplesForTab(currentTab);
	//console.log(currentTab);
	    chrome.tabs.query({}, function(allTabs) {
	        for(k in allTabs){
	            var tab = allTabs[k];
	            if(tab.id != currentTab.id){
	            	if(isTabsIdInArray(tab.id,coupledTabs)){
	            		chrome.tabs.sendMessage(tab.id, msg,function(response){
		            		//console.info("response: " + response);
		            	});
	            	}
	            	//console.log("sent from tab " + currentTab.id  +" to tab ", tab.id);
	            }
	            else{
	            	//console.info("dont send to yourself!!!");
	            }
	        }
	    });
	});
};
