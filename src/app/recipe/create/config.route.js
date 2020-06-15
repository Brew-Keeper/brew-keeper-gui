(function() {
  'use strict';

  angular
    .module('app.recipe.create')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/users/:username/recipes/create', {
        templateUrl: 'app/recipe/create/recipe-creation.html',
        controller: 'RecipeCreationController',
        controllerAs: 'vm'
      });
  }
})();
