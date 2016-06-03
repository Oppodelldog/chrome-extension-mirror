
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.element!=""){
		var el = document.querySelector(request.element);
	    if(el !== null){
			var e = request.e;
	    	switch(request.event){
	    		case 'focus':
	    			el.focus();
	    			if(typeof el.select !== "undefined"){
	    				el.select();
	    			}
	    		break;

	    		case 'change':
	    			el.value=request.value;
	    		break; 		

	    		case 'click':
	    			dispatchMouseEvent('click',el,e);
	    		break; 		
	    		case 'mousemove':
	    			dispatchMouseEvent('mousemove',el,e);
	    		break; 	
	    		case 'mousedown':
					dispatchMouseEvent('mousedown',el,e);    		
	    		break; 	
	    		case 'mouseup':
					dispatchMouseEvent('mouseup',el,e);
	    		break; 	
	    	}
	    	
	    	sendResponse(request.event + " on " + el.tagName + " path:\n" + request.element);
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
});

function dispatchMouseEvent(eventName,element,eventInfo){
					ev = new MouseEvent(eventName,{
					    bubbles: true,
					    cancelable: true,
				    	clientX:eventInfo.clientX,
						clientY:eventInfo.clientY,
						screenX:eventInfo.screenX,
						screenY:eventInfo.screenY
					  });
	    			element.dispatchEvent(ev);
}

function broadcastMouseEvent(eventName,event){
	chrome.extension.sendMessage({
		element: DomUtil.getDomPath(event.srcElement),
		event: eventName,
		e:{
			clientX:event.clientX,
			clientY:event.clientY,
			screenX:event.screenX,
			screenY:event.screenY,
		}		
	});	
}

function broadcastEvent(eventName,event){
	chrome.extension.sendMessage({
		element: DomUtil.getDomPath(event.srcElement),
		event: eventName,
	});	
}

function broadcastChangeEvent(event){
	chrome.extension.sendMessage({
		element: DomUtil.getDomPath(event.srcElement),
		event: 'change',
		value: event.srcElement.value
	});	
}
function broadcastScrollEvent(event){
	chrome.extension.sendMessage({
		element:'',
		event: 'scroll',
		scrollY: this.scrollY,
		scrollX: this.scrollX
	});	
}


document.addEventListener('click', function (e) {
	// stacked elements behavior workaround
	if(e.detail==0){
		return;
	}
	broadcastMouseEvent('click',e);
},true);

document.addEventListener('focus', function (e) { broadcastEvent('focus',e); },true);
document.addEventListener('mousedown', function (e) { broadcastMouseEvent('mousedown',e); },true);
document.addEventListener('mouseup', function (e) { broadcastMouseEvent('mouseup',e); },true);
document.addEventListener('mousemove', function (e) { broadcastMouseEvent('mousemove',e); },true);
document.addEventListener('change', function (e) { broadcastChangeEvent(e); },false);
window.addEventListener('scroll', function (e) {broadcastScrollEvent(e); },true);

