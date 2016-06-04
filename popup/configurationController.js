angular.module('app').controller("ConfigurationController", function($scope){
    var vm = this;
    vm.testUrl="";
    vm.title = 'Configuration';

    this.prependRegExEntryToList = function(list){
    	list.unshift("HALLO");
    }
    this.removeRegExEntryFromList = function(list,index){
    	list.splice(index, 1);  
    }
    this.removeConfigurationEntry = function(index){
    	vm.configuration.splice(index,1);
    }
    this.prependConfigurationEntry = function(){
    	vm.configuration.unshift({regExList:[]})
    }
    this.testUrlAgainstRegEx = function(regEx){
    	var regularExpression = new RegExp(regEx);
    	return (regularExpression.exec(vm.testUrl) != null);
    }
    loadConfiguration(function(configuration){
    	vm.configuration = configuration;
    	
    });
});

function loadConfiguration(successFunc){
	var conf = [
			{groupName:"Mongo", regExList :[ ".*mongos.*" ]},
    		{groupName:"Google", regExList :[ ".*google\\.de.*" ,".*google\\.fr.*", ".*google\\.ch.*"]}
    	];
	successFunc(conf);
}