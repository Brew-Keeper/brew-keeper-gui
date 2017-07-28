;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .config(config);

  config.$inject = ['$routeProvider', '$compileProvider'];

  function config($routeProvider, $compileProvider) {
    // Disable debug
    $compileProvider.debugInfoEnabled(false);

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
        templateUrl: 'app/user/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
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
        resolve: {
          recipePrep: recipePrep
        }
      })
      .when('/:username/:id/brewit', {
        templateUrl: 'app/brew/brew-it.html',
        controller: 'BrewItController',
        controllerAs: 'vm',
        resolve: {
          recipePrep: recipePrep
        }
      });

      // .otherwise({
      //   redirectTo: '/404.html',
      //   templateUrl: 'partials/404.html'
      // })
  }

  recipePrep.$inject = ['$location', '$rootScope', '$route', 'recipeService'];

  function recipePrep($location, $rootScope, $route, recipeService) {
    var isPublic = ($location.path().indexOf('/public') === 0);
    var localUser = isPublic ? 'public' : $rootScope.username;
    var recipeId = $route.current.params.id;
    var detail = $location.path() == '/' + localUser + '/' + recipeId;

    return recipeService.getRecipe(recipeId, localUser, detail);
  }

})();
