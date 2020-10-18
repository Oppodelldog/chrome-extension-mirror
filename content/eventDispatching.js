const debugEvents = false;
const debugElementPathIssues = false;

function receiveEventBroadcastFromBackgroundScript(request) {
    if (debugEvents === true && request.event === "change") {
        console.log(request)
    }

    if (request.type === "COUPLING_STATUS_CHANGE") {
        handleCouplingStatusChange(request);
    } else if (request.elementPath !== "") {
        const element = DomUtil.findElementByPath(request.elementPath);
        if (element === null) {
            if (debugElementPathIssues) {
                console.warn("was not able to find element by path: ", request.elementPath)
            }
            return;
        }
        dispatchDomElementEvent(request, element);
    } else {
        dispatchNonDomElementEvent(request);
    }
}

chrome.runtime.onMessage.addListener(receiveEventBroadcastFromBackgroundScript);

function dispatchNonDomElementEvent(request) {
    switch (request.event) {
        case 'scroll':
            dispatchScrollEvent(window, request);
            break;
    }
}

function dispatchDomElementEvent(request, element) {
    switch (request.event) {
        case 'focus':
            element.focus();
            if (typeof element.select !== "undefined") {
                element.select();
            }
            break;
        case 'change':
            element.value = request.value;
            dispatchEvent('change', element);
            break;
        case 'click':
            dispatchMouseEvent('click', element, request.mouseEventInfo);
            break;
        case 'mousemove':
            dispatchMouseEvent('mousemove', element, request.mouseEventInfo);
            break;
        case 'mousedown':
            dispatchMouseEvent('mousedown', element, request.mouseEventInfo);
            break;
        case 'mouseup':
            dispatchMouseEvent('mouseup', element, request.mouseEventInfo);
            break;
        case 'scroll':
            dispatchScrollEvent(element, request);
            break;
    }
}

function dispatchEvent(eventName, element) {
    let ev = new Event(eventName);
    element.dispatchEvent(ev);
}

function dispatchMouseEvent(eventName, element, mouseEventInfo) {
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

function dispatchScrollEvent(element, request) {
    element.scroll(request.scrollX, request.scrollY);
}
