(function() {  // IIFE
  'use strict';

  angular
    .module('app.recipes')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/public', {
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/public/users/:username', {
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/public/:id', {
        templateUrl: 'app/recipes/public-detail.html',
        controller: 'PublicDetailController',
        controllerAs: 'vm',
        resolve: {
          recipePrep: recipePrep
        }
      })
      .when('/public/:id/brewit', {
        templateUrl: 'app/brew/brew-it.html',
        controller: 'BrewItController',
        controllerAs: 'vm',
        resolve: {
          recipePrep: recipePrep
        }
      })
      .when('/users/:username/recipes', {
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'RecipeListController',
        controllerAs: 'vm'
      })
      .when('/users/:username/clone/:id', {
        templateUrl: 'app/recipes/clone.html',
        controller:  'CloneController',
        controllerAs: 'vm'
      })
      .when('/users/:username/recipes/create', {
        templateUrl: 'app/recipes/recipe-creation.html',
        controller: 'RecipeCreationController',
        controllerAs: 'vm'
      })
      .when('/users/:username/recipes/:id', {
        templateUrl: 'app/recipes/recipe-detail.html',
        controller: 'RecipeDetailController',
        controllerAs: 'vm',
        resolve: {
          recipePrep: recipePrep
        }
      });
  }

  recipePrep.$inject = ['$location', '$rootScope', '$route', 'recipeService'];

  function recipePrep($location, $rootScope, $route, recipeService) {
    var isPublic = ($location.path().indexOf('/public') === 0);
    var localUser = isPublic ? 'public' : $rootScope.username;
    var recipeId = $route.current.params.id;
    var detail = $location.path() == '/' + localUser + '/' + recipeId;

    if (localUser === undefined || null) {
      $location.path('/public');
      return;
    }
    return recipeService.getRecipe(recipeId, localUser, detail);
  }
})();
