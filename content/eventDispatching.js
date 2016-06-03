function receiveEventBroadcastFromBackgroundScript(request, sender, sendResponse) {
	if(request.elementPath!=""){
		var element = document.querySelector(request.elementPath);
	    if(element !== null){
			var mouseEventInfo = request.mouseEventInfo;
	    	switch(request.event){
	    		case 'focus':
	    			element.focus();
	    			if(typeof element.select !== "undefined"){
	    				element.select();
	    			}
	    		break;

	    		case 'change':
	    			element.value=request.value;
	    		break; 		

	    		case 'click':
	    			dispatchMouseEvent('click',element,mouseEventInfo);
	    		break; 		
	    		case 'mousemove':
	    			dispatchMouseEvent('mousemove',element,mouseEventInfo);
	    		break; 	
	    		case 'mousedown':
					dispatchMouseEvent('mousedown',element,mouseEventInfo);    		
	    		break; 	
	    		case 'mouseup':
					dispatchMouseEvent('mouseup',element,mouseEventInfo);
	    		break; 	
	    	}
	    	
	    	sendResponse(request.event + " on " + element.tagName + " path:\n" + request.elementPath);
	    }else {
	    	// often occurs, since content script is duplicated into multiple contexts, not only the webpage itself
	    }
	}else{
    	switch(request.event){
    		case 'scroll':
    			window.scroll(request.scrollX,request.scrollY);
    		break;    		
    	}
    	sendResponse("NON ELEMENT EVENT TRIGGERED " + request.event);    	
    }
}
chrome.runtime.onMessage.addListener(receiveEventBroadcastFromBackgroundScript);

function dispatchMouseEvent(eventName,element,mouseEventInfo){
	ev = new MouseEvent(eventName,{
	    bubbles: true,
	    cancelable: true,
    	clientX:mouseEventInfo.clientX,
		clientY:mouseEventInfo.clientY,
		screenX:mouseEventInfo.screenX,
		screenY:mouseEventInfo.screenY
	  });
	element.dispatchEvent(ev);
}


