;(function() {  //IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RecipeListController', RecipeListController)
    .controller('PublicRecipeController', PublicRecipeController);

  RecipeListController.$inject =
    ['$rootScope', '$scope', '$http', '$routeParams', '$location'];

  function RecipeListController($rootScope, $scope, $http, $routeParams, $location) {
    var vm = this;
    vm.listBrewIt = listBrewIt;
    vm.rateRecipe = rateRecipe;
    vm.ratings = [{max: 5}];
    vm.recipeUrl = $rootScope.baseUrl + '/api/users/' + $rootScope.username + '/recipes/';
    vm.recipes = [];
    vm.search = search;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      // Get the recipes for this user
      $http.get(vm.recipeUrl)
        .then(function(response) {
          vm.recipes = response.data;
        });
    }

    /**
     * Brew a recipe in the list.
     */
    function listBrewIt(id) {
      //get indexOf recipe id
      var recipeId;
      for (var index = 0; index < vm.recipes.length; index ++) {
        if (vm.recipes[index].id == id) {
          recipeId = index;
        }
      }
      // FIXME: We set these on $rootScope, but don't end up using them.
      $rootScope.steps = vm.recipes[recipeId].steps;
      $rootScope.detail = vm.recipes[recipeId];
      $location.path("/" + $rootScope.username + "/" + id + "/brewit");
    }

    /**
     * Rate a recipe in the list.
     */
    function rateRecipe(rating, id) {
      var newRating = {"rating": rating};
      $http.patch(vm.recipeUrl + id + '/', newRating);
    }

    /**
     * Display all of the user's recipes matching the given string.
     */
    function search(searchString) {
      $http.get(vm.recipeUrl + '?search=' + searchString)
        .then(function(response) {
          vm.recipes = response.data;
        });
    }
  }


  PublicRecipeController.$inject =
    ['$http', '$scope', '$rootScope', '$location', '$routeParams'];

  function PublicRecipeController($http, $scope, $rootScope, $location, $routeParams) {
    var vm = this;
    vm.newRating = newRating;
    vm.publicListBrewIt = publicListBrewIt;
    vm.search = search;
    vm.updateRating = updateRating;
    vm.ratings = [{max: 5}];
    vm.recipes = [];

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      if ($routeParams.username) {
        // If provided, show the public recipes for the specified user
        vm.search($routeParams.username);
      } else {
        // ...otherwise, show all public recipes
        $http.get($rootScope.baseUrl + '/api/users/public/recipes/')
          .then(function(response) {
            vm.recipes = response.data;
          });
      }
    }

    /**
     * Submit a rating for a public recipe.
     */
    function newRating(rating, recipeId) {
      var providedRating = {"public_rating": rating};
      $http.post($rootScope.baseUrl + '/api/users/public/recipes/' + recipeId + '/ratings/', providedRating)
        // Now that we have posted, let's update the rating to reflect the change
        .then(function() {
          $http.get($rootScope.baseUrl + '/api/users/public/recipes/')
            .then(function(response){
              vm.recipes = response.data;
            });
        });
    }

    /**
     * Brew the selected public recipe.
     */
    function publicListBrewIt(id) {
      // Get index of recipe id in vm.recipes
      var recipeId;
      for (var index = 0; index < vm.recipes.length; index ++) {
        if (vm.recipes[index].id == id) {
          recipeId = index;
        }
      }
      // If we didn't find it for some reason, we're done here
      if (recipeId === undefined) {
        return;
      }
      // TODO: These rootScope assignments are currently superfluous
      $rootScope.steps = vm.recipes[recipeId].steps;
      $rootScope.detail = vm.recipes[recipeId];
      // Switch to the public brew-it for this recipe
      $location.path("/public/" + id + "/brewit");
    }

    /**
     * Search all public recipes for the specified string.
     */
    function search(searchString) {
      $http.get($rootScope.baseUrl + '/api/users/public/recipes/?search=' + searchString)
        .then(function(response) {
          vm.recipes = response.data;
        });
    }

    /**
     * Update an existing public rating.
     */
    function updateRating(rating, ratingId, recipeId) {
      var providedRating = {"public_rating": rating};
      $http.patch($rootScope.baseUrl + '/api/users/public/recipes/' + recipeId + '/ratings/' + ratingId + '/', providedRating);
    }
  }
})();
