;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .config(config);

  function config($routeProvider) {
    $routeProvider
      .when('/',{
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'WhoAmIController'
      })
      .when('/info', {
        templateUrl: 'partials/more-info.html',
        controller: 'LoginController',
      })
      .when('/login', {
        templateUrl: 'partials/login.html'
      })
      .when('/public',{
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/public/users/:username', {
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/public/:id',{
        templateUrl: 'app/recipes/public-detail.html',
        controller: 'PublicDetailController',
        controllerAs: 'vm'
      })
      .when('/public/:id/brewit', {
        templateUrl: 'app/brew/brew-it.html',
        controller: 'BrewItController',
        controllerAs: 'vm'
      })
      .when('/reset-pw', {
        templateUrl: 'partials/reset-pw.html',
        controller: 'ChangePasswordController'
      })
      .when('/:username', {
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/:username/clone/:id', {
        templateUrl: 'app/recipes/clone.html',
        controller:  'CloneController',
        controllerAs: 'vm'
      })
      .when('/:username/new', {
        templateUrl: 'app/recipes/recipe-creation.html',
        controller: 'RecipeCreationController',
        controllerAs: 'vm'
      })
      .when('/:username/:id', {
        templateUrl: 'app/recipes/recipe-detail.html',
        controller: 'RecipeDetailController',
        controllerAs: 'vm',
      })
      .when('/:username/:id/brewit', {
        templateUrl: 'app/brew/brew-it.html',
        controller: 'BrewItController',
        controllerAs: 'vm'
      });

      // .otherwise({
      //   redirectTo: '/404.html',
      //   templateUrl: 'partials/404.html'
      // })
  }
})();
