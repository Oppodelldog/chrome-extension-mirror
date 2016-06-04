  
angular.module('app').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: 'templates/overview.html',
        controller: 'OverviewController',
        controllerAs: 'vm',
      }).
      otherwise({
        redirectTo: '/overview'
      });
  }]);