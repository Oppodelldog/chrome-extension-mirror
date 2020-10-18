function saveCouplings(couplings) {
    localStorage["coupling"] = couplings;
}

function loadCouplings() {
    return localStorage["coupling"];
}

function loadCouplingsAsObject() {
    return JSON.parse(loadCouplings())
}

function saveGeneralConfig(generalConfig) {
    localStorage["general"] = generalConfig;
}

function loadGeneralConfig() {
    let config = localStorage["general"];
    if (typeof config === "undefined" || config === null) {
        return {"enabled": true}
    }

    return config;
}

function loadGeneralConfigAsObject() {
    return JSON.parse(loadGeneralConfig())
}

