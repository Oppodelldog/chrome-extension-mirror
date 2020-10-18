function saveConfiguration(config) {
    localStorage["coupling"] = config;
}

function loadConfiguration() {
    return localStorage["coupling"];
}

function loadConfigurationAsObject() {
    return JSON.parse(loadConfiguration())
}