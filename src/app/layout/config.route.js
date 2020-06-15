(function() {
  'use strict';

  angular
    .module('app.layout')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/recipe/list/recipe-list.html',
        controller: 'RootController'
      })
      .when('/about', {
        templateUrl: 'app/about/about.html',
      })
      .when('/creator-detail', {
        templateUrl: 'app/about/creator-detail.html',
      })
      .otherwise({
        redirectTo: '/not-found',
        templateUrl: 'app/layout/404.html'
      });
  }
})();
