  
angular.module('app').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/configuration', {
        templateUrl: 'templates/configuration.html',
        controller: 'ConfigurationController',
        controllerAs: 'vm',
      }).      
      otherwise({
        redirectTo: '/configuration'
      });
  }]);