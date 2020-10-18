const controller = angular.module('app').controller("ConfigurationController", function ($scope) {
    const vm = this;
    vm.testUrl = "";
    vm.title = 'Configuration';
    const backgroundPage = chrome.extension.getBackgroundPage();

    this.prependRegExEntryToList = function (list) {
        list.unshift({regEx: ""});
    }
    this.removeRegExEntryFromList = function (list, index) {
        list.splice(index, 1);
    }
    this.removeConfigurationEntry = function (index) {
        vm.couplings.splice(index, 1);
    }
    this.prependConfigurationEntry = function () {
        vm.couplings.unshift({regExList: []})
    }
    this.testUrlAgainstRegEx = function (regEx) {
        const regularExpression = new RegExp(regEx);
        return (regularExpression.exec(vm.testUrl) != null);
    }
    this.loadConfiguration = function () {
        vm.generalConfig = angular.fromJson(chrome.extension.getBackgroundPage().loadGeneralConfig());
        vm.couplings = angular.fromJson(chrome.extension.getBackgroundPage().loadCouplings());
        if (typeof vm.couplings === "undefined") {
            this.initCouplings();
        }
    };

    this.initCouplings = function () {
        vm.couplings = [];
    }

    this.saveConfiguration = function () {
        backgroundPage.saveCouplings(angular.toJson(vm.couplings));
        backgroundPage.sync();
    }

    this.toggleEnabled = function () {
        vm.generalConfig.enabled = !vm.generalConfig.enabled;
        backgroundPage.saveGeneralConfig(angular.toJson(vm.generalConfig));
        if (vm.generalConfig.enabled) {
            backgroundPage.enableExtension()
        } else {
            backgroundPage.disableExtension()
        }
    }

    this.loadConfiguration();
});

document.addEventListener("unload", function (e) {
    alert("CLOSED");
}, true);
