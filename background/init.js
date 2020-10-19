function initCoupleEvents() {
    coupler.onDecouple = ((tabId, groupName) => {
        try {
            chrome.tabs.sendMessage(tabId, {
                type: "COUPLING_STATUS_CHANGE",
                value: "DECOUPLED",
                groupName: groupName,
            });

        } catch (e) {
            console.error("could not send DECOUPLED message to tab:", tabId)
            console.error(e)
        }
    })

    coupler.onCouple = ((tabId, groupName) => {
        try {
            chrome.tabs.sendMessage(tabId, {
                type: "COUPLING_STATUS_CHANGE",
                value: "COUPLED",
                groupName: groupName,
            });
        } catch (e) {
            console.error("could not send COUPLED message to tab:", tabId)
            console.error(e)
        }
    })
}


initContentScriptEventListener()
initCoupling()
initCoupleEvents()

let generalConfig = loadGeneralConfigAsObject();
if (generalConfig.enabled) {
    enableExtension();
}