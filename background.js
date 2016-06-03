
function receiveEventBroadcastFromContentScript(request, sender, sendResponse) {
	chrome.tabs.getSelected(null,function(currentTab){
    	if(currentTab.id == sender.tab.id){
    		//console.info("passthrough " + request.event + " on path:\n " + request.element);
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
	//console.log(currentTab);
	    chrome.tabs.query({
	        url: currentTab.url.split('#')[0]
	    }, function(tabs) {
	        for(k in tabs){
	            var tab = tabs[k];
	            if(tab.id != currentTab.id){
	            	chrome.tabs.sendMessage(tab.id, msg,function(response){
	            		//console.info("response: " + response);
	            	});
	            	//console.log("sent from tab " + currentTab.id  +" to tab ", tab.id);
	            }
	            else{
	            	//console.info("dont send to yourself!!!");
	            }
	        }
	    });
	});
};

