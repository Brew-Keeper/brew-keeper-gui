(function() {  // IIFE
  'use strict';

  angular
    .module('app.layout')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/recipes/recipe-list.html',
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
        templateUrl: 'partials/404.html'
      });
  }
})();
