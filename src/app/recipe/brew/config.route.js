(function() {
  'use strict';

  angular
    .module('app.recipe.brew')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/public/:id/brewit', {
        templateUrl: 'app/recipe/brew/brew-it.html',
        controller: 'BrewItController',
        controllerAs: 'vm',
        resolve: {
          recipePrep: recipePrep
        }
      })
      .when('/users/:username/recipes/:id/brewit', {
        templateUrl: 'app/recipe/brew/brew-it.html',
        controller: 'BrewItController',
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

    if (localUser === undefined || null) {
      $location.search("target", $location.path());
      $location.path('/login');
      return;
    }

    var recipe = recipeService.getRecipe(recipeId, localUser);

    if (recipe === 'error') {
      $location.path('/public');
    } else {
      return recipe;
    }
  }
})();
