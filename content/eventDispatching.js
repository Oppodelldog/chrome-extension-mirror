function receiveEventBroadcastFromBackgroundScript(request, sender, sendResponse) {
	if(request.elementPath!==""){
		const element = DomUtil.findElementByPath(request.elementPath);
		if(element === null){
			// element not found by path
		    // might be an issue while ressembling the elements path, but also occurs
		    // since the content scripts are injected all iframes like	
		    return;
		}		
		dispatchDomElementEvent(request,element);
	}else{
    	dispatchNonDomElementEvent(request,sendResponse);  	
    }
}
chrome.runtime.onMessage.addListener(receiveEventBroadcastFromBackgroundScript);

function dispatchNonDomElementEvent(request, sendResponse){
	switch(request.event){
		case 'scroll':
			window.scroll(request.scrollX,request.scrollY);
		break;    		
	}
	//sendResponse("NON ELEMENT EVENT TRIGGERED " + request.event);  	
}

function dispatchDomElementEvent(request, element, sendResponse){
	switch(request.event){
		case 'focus':
			element.focus();
			if(typeof element.select !== "undefined"){
				element.select();
			}
		break;

		case 'change':
			element.value=request.value;
			dispatchEvent('change',element);
		break; 		

		case 'click':
			dispatchMouseEvent('click',element,request.mouseEventInfo);
		break; 		
		case 'mousemove':
			dispatchMouseEvent('mousemove',element,request.mouseEventInfo);
		break; 	
		case 'mousedown':
			dispatchMouseEvent('mousedown',element,request.mouseEventInfo);    		
		break; 	
		case 'mouseup':
			dispatchMouseEvent('mouseup',element,request.mouseEventInfo);
		break; 	
	}
}

function dispatchEvent(eventName,element){
	let ev = new Event(eventName);
	element.dispatchEvent(ev);
}

function dispatchMouseEvent(eventName,element,mouseEventInfo){
	let ev = new MouseEvent(eventName, {
		bubbles: true,
		cancelable: true,
		clientX: mouseEventInfo.clientX,
		clientY: mouseEventInfo.clientY,
		screenX: mouseEventInfo.screenX,
		screenY: mouseEventInfo.screenY,
		inputDeviceCapabilities: new InputDeviceCapabilities()
	});
	element.dispatchEvent(ev);
}
