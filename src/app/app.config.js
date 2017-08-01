(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .config(config);

  config.$inject = ['$routeProvider', '$compileProvider'];

  function config($routeProvider, $compileProvider) {
    // Disable debug
    $compileProvider.debugInfoEnabled(false);

    $routeProvider
      .when('/', {
        templateUrl: 'app/recipes/recipe-list.html',
        controller: 'RootController'
      })
      .when('/about', {
        templateUrl: 'app/about/about.html',
      })
      .when('/change-password', {
        templateUrl: 'app/user/change-password.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm'
      })
      .when('/creator-detail', {
        templateUrl: 'app/about/creator-detail.html',
      })
      .when('/login', {
        templateUrl: 'app/user/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
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
      .when('/reset-pw', {
        templateUrl: 'app/user/reset-password.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm'
      })
      .when('/send-reset', {
        templateUrl: 'app/user/send-reset.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm'
      })
      .when('/signup', {
        templateUrl: 'app/user/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
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
      })
      .when('/users/:username/recipes/:id/brewit', {
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

    if (localUser === undefined || null) {
      $location.path('/login');
      return;
    }
    return recipeService.getRecipe(recipeId, localUser, detail);
  }
})();
