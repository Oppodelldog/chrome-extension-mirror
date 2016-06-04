  
angular.module('app').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: 'templates/overview.html',
        controller: 'OverviewController',
        controllerAs: 'vm',
      }).
      when('/configuration', {
        templateUrl: 'templates/configuration.html',
        controller: 'ConfigurationController',
        controllerAs: 'vm',
      }).      
      otherwise({
        redirectTo: '/configuration'
      });
  }]);