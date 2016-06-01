
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.tabs.getSelected(null,function(currentTab){
    	//console.log("sent from tab.id=", sender.tab.id);
    	if(currentTab.id == sender.tab.id){
    		console.info("passthrough " + request.event + " on path:\n " + request.element);
    		sendEventToUkTab(request);
    	}
    	else{
    		//console.info("don't route from self events");
    	}
	})
});


function sendEventToUkTab(msg) {

	chrome.tabs.getSelected(null,function(currentTab){
	//console.log(currentTab);
	    chrome.tabs.query({
	        url: currentTab.url.split('#')[0]
	    }, function(tabs) {
	        for(k in tabs){
	            var tab = tabs[k];
	            if(tab.id != currentTab.id){
	            	chrome.tabs.sendMessage(tab.id, msg,function(response){
	            		console.info("response from foreign content-script:" + response);
	            	});
	            	//console.log("sent message to tab:" + tab.id);
	            }
	            else{
	            	//console.info("dont send to yourself!!!");
	            }
	        }
	    });
	});
};

