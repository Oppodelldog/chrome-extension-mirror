
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.element!=""){
		var el = document.querySelector(request.element);
	    if(el !== null){

	    	//el.innerHTML = "LOOK INTO THE MIRROR!!!!"; // turn it on!!!!
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
	    			el.click();
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

document.addEventListener('click', function (e) {
	if(e.detail==0){
		return;
	}
	console.info("captured click event");
	chrome.extension.sendMessage({
		element: getDomPath(e.srcElement),
		event: 'click'
	});	
},true);
document.addEventListener('focus', function (e) {
	console.info("captured focus event");
	chrome.extension.sendMessage({
		element: getDomPath(e.srcElement),
		event: 'focus',
	});	
},true);
document.addEventListener('changed', function (e) {
	console.info("captured changed event");
	chrome.extension.sendMessage({
		element: getDomPath(e.srcElement),
		event: 'change',
		value: e.srcElement.value
	});	
},true);

window.addEventListener('scroll', function (e) {
	console.info("captured scroll event");
	chrome.extension.sendMessage({
		element:'',
		event: 'scroll',
		scrollY: this.scrollY,
		scrollX: this.scrollX
	});	
},true);

/*
creditz to the guy who posted that on stack overflow
works really fineeEEEee. hat to replace that crazy eq(0) syntax.
did not read and understand the code but 't'werks
*/
function getDomPath(el) {
  var stack = [];
  while ( el.parentNode != null ) {
    var sibCount = 0;
    var sibIndex = 0;
    for ( var i = 0; i < el.parentNode.childNodes.length; i++ ) {
      var sib = el.parentNode.childNodes[i];
      if ( sib.nodeName == el.nodeName ) {
        if ( sib === el ) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    if ( el.hasAttribute('id') && el.id != '' ) {
      stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
    } else if ( sibCount > 1  ) {
      stack.unshift(el.nodeName.toLowerCase() + ':nth-of-type(' + parseInt(sibIndex+1) + ')');
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode;
  }

  return stack.slice(1).join(" "); // removes the html element and build a reusable querySelector string
}