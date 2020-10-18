const controller = angular.module('app').controller("ConfigurationController", function ($scope) {
    const vm = this;
    vm.testUrl = "";
    vm.title = 'Configuration';

    this.prependRegExEntryToList = function (list) {
        list.unshift({regEx: ""});
    }
    this.removeRegExEntryFromList = function (list, index) {
        list.splice(index, 1);
    }
    this.removeConfigurationEntry = function (index) {
        vm.configuration.splice(index, 1);
    }
    this.prependConfigurationEntry = function () {
        vm.configuration.unshift({regExList: []})
    }
    this.testUrlAgainstRegEx = function (regEx) {
        const regularExpression = new RegExp(regEx);
        return (regularExpression.exec(vm.testUrl) != null);
    }
    this.loadConfiguration = function () {
        vm.configuration = angular.fromJson(chrome.extension.getBackgroundPage().loadConfiguration());
        if (typeof vm.configuration === "undefined") {
            this.prepareInitialConfiguration();
        }
    };
    this.prepareInitialConfiguration = function () {
        vm.configuration = [];
    }

    this.saveConfiguration = function () {
        let backgroundPage = chrome.extension.getBackgroundPage();
        backgroundPage.saveConfiguration(angular.toJson(vm.configuration));
        backgroundPage.sync();
    }

    this.loadConfiguration();
});

document.addEventListener("unload", function (e) {
    alert("CLOSED");
}, true);
