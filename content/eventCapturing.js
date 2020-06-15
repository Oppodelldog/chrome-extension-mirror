function broadCastToBackgroundScript(obj){
	chrome.extension.sendMessage(obj);
}

function broadcastMouseEvent(eventName,event){
	broadCastToBackgroundScript({
		elementPath: DomUtil.getDomPath(event.srcElement),
		event: eventName,
		mouseEventInfo:{
			clientX:event.clientX,
			clientY:event.clientY,
			screenX:event.screenX,
			screenY:event.screenY,
		}		
	});	
}

function broadcastEvent(eventName,event){
	broadCastToBackgroundScript({
		elementPath: DomUtil.getDomPath(event.srcElement),
		event: eventName,
	});	
}

function broadcastChangeEvent(event){
	broadCastToBackgroundScript({
		elementPath: DomUtil.getDomPath(event.srcElement),
		event: 'change',
		value: event.srcElement.value
	});	
}

function broadcastScrollEvent(event){
	broadCastToBackgroundScript({
		elementPath:'',
		event: 'scroll',
		scrollY: this.scrollY,
		scrollX: this.scrollX
	});	
}


document.addEventListener('click', function (e) {
	/*
		overlaying elements still a problem.
		sample one some webpage:
		<label>
			<span/>
			<input type=checkbox/>
		</abel>
		the span overlays the checkbox.
		if you click the span three events are fired
		1. click on span
		2. click on input
		3. focus on input (that should be default browser behavior event)

		but if the two first events are broadcasted to another tab it will
		dispatch both click events after each other which lead to 
		1. select the checkbox
		2. deselect the checkbox
		*BAM* inconsistent state ! mirror plugin go home! 

		by trial an error i fixed this using that mysterious detail flag.
		But I really like to write reliable software without any mysterios logic
		so this needs to be fixed.
	*/
	if(e.detail===0){
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