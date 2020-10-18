function handleCouplingStatusChange(request) {
    let elem = document.createElement('div');
    elem.id = "mirror-extension-couplingIndicator"
    const css = 'position:fixed;box-sizing: border-box;top:0;right:0;width:40px;height:40px;opacity:0.3;z-index:100;background-color:#00ff00;';
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
