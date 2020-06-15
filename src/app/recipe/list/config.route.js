(function() {
  'use strict';

  angular
    .module('app.recipe.list')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/public', {
        templateUrl: 'app/recipe/list/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/public/users/:username', {
        templateUrl: 'app/recipe/list/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/users/:username/recipes', {
        templateUrl: 'app/recipe/list/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      });
  }
})();
