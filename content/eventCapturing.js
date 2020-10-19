function broadCastToBackgroundScript(obj) {
    chrome.extension.sendMessage(obj);
}

function broadcastMouseEvent(eventName, event) {
    broadCastToBackgroundScript({
        elementPath: DomUtil.getDomPath(event.srcElement),
        event: eventName,
        mouseEventInfo: {
            clientX: event.clientX,
            clientY: event.clientY,
            screenX: event.screenX,
            screenY: event.screenY,
        }
    });
}

function broadcastEvent(eventName, event) {
    broadCastToBackgroundScript({
        elementPath: DomUtil.getDomPath(event.srcElement),
        event: eventName,
    });
}

function broadcastChangeEvent(event) {
    broadCastToBackgroundScript({
        elementPath: DomUtil.getDomPath(event.target),
        event: 'change',
        value: event.target.value
    });
}

function broadcastScrollEvent(event) {
    const el = event.target;
    const isDocument = (event.target === document)

    broadCastToBackgroundScript({
        elementPath: DomUtil.getDomPath(el),
        event: 'scroll',
        scrollY: (isDocument) ? window.scrollY : el.scrollTop,
        scrollX: (isDocument) ? window.scrollX : el.scrollLeft
    });
}

function initEventListeners() {
    document.addEventListener('click', function (e) {
        let clickCount = e.detail;
        if (clickCount === 0) {
            return;
        }
        broadcastMouseEvent('click', e);
    }, true);

    document.addEventListener('focus', function (e) {
            broadcastEvent('focus', e);
        },
        true
    );
    document.addEventListener('mousedown', function (e) {
            broadcastMouseEvent('mousedown', e);
        },
        true
    );
    document.addEventListener('mouseup', function (e) {
            broadcastMouseEvent('mouseup', e);
        },
        true
    );
    document.addEventListener('mousemove', function (e) {
            broadcastMouseEvent('mousemove', e);
        },
        true
    );
    document.addEventListener('change', function (e) {
            broadcastChangeEvent(e);
        },
        true
    );
    window.addEventListener('scroll', function (e) {
            broadcastScrollEvent(e);
        },
        true
    );
}