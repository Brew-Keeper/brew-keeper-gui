(function() {  // IIFE
  'use strict';

  angular
    .module('app.recipe.clone')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/users/:username/clone/:id', {
        templateUrl: 'app/recipe/clone/clone.html',
        controller:  'CloneController',
        controllerAs: 'vm'
      });
  }
})();
