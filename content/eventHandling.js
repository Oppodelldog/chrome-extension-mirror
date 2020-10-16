const stopPropagation = window.Event.prototype.stopPropagation;
window.Event.prototype.stopPropagation = function () {
    stopPropagation.apply(this);
    const e = this;
    let msg = {type: "STOP_PROPAGATION_PROXY", event: {}}
    switch (e.type) {
        case "change":
            msg.event.elementPath = DomUtil.getDomPath(e.target);
            msg.event.event = e.type;
            msg.event.value = e.target.value;
            break;
        default:
            msg = null;
    }

    if (msg) {
        window.postMessage(msg, "*");
    }
}
