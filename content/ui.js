function handleCouplingStatusChange(request) {
    let elem = document.createElement('div');
    elem.id = "mirror-extension-couplingIndicator"
    elem.title = "This tab is mirrored by Mirror Extension"
    const css = getIndicatorCss();
    const existingElem = document.getElementById(elem.id);

    if (existingElem !== null) {
        elem = existingElem
    } else {
        document.body.appendChild(elem);
    }

    elem.style.cssText = css;

    if (request.value === "COUPLED") {
        elem.style.cssText = css;
    }

    if (request.value === "DECOUPLED") {
        elem.style.cssText = css + "display:none";
    }
}

function getIndicatorCss() {
    const iconUrl = chrome.extension.getURL("icons/icon16.png")
    return `
    position:fixed;
    display:flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    top:0;
    right:0;
    width:40px;
    height:40px;
    z-index:22222;
    background-color:rgba(204, 204 ,204, 0.47);
    font-size: 30px;
    font-weight: bold;
    font-family:monospace;
    color:black;
    background-image:url(${iconUrl});
    background-position: center;
    background-repeat: no-repeat;
    `.replaceAll('\n', '');
}