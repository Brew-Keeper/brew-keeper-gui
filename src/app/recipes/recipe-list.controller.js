;(function() {  // IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RecipeListController', RecipeListController)
    .controller('PublicRecipeController', PublicRecipeController);

  RecipeListController.$inject =
    ['$rootScope', '$scope', '$http', '$routeParams', '$location'];

  function RecipeListController($rootScope, $scope, $http, $routeParams, $location) {
    var vm = this;
    vm.isPublic = ($location.path().indexOf('/public') === 0);
    vm.listBrewIt = listBrewIt;
    vm.newRating = newRating;
    vm.rateRecipe = rateRecipe;
    vm.ratingOrderBy = ratingOrderBy;
    vm.ratings = [{max: $rootScope.maxStars}];
    vm.recipeUrl = null;
    vm.recipes = [];
    vm.search = search;
    vm.updateRating = updateRating;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      if (vm.isPublic) {
        vm.recipeUrl = $rootScope.baseUrl + '/api/users/public/recipes/';
        if ($routeParams.username) {
          // If provided, show the public recipes for the specified user
          vm.search($routeParams.username);
          return;
        }
      } else {
        vm.recipeUrl = $rootScope.baseUrl + '/api/users/' + $rootScope.username + '/recipes/';
      }
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
      $location.path("/" + (vm.isPublic ? 'public' : $rootScope.username) +
        "/" + id + "/brewit");
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
     * Rate a recipe in the list.
     */
    function rateRecipe(rating, id) {
      var newRating = {"rating": rating};
      $http.patch(vm.recipeUrl + id + '/', newRating);
    }

    /**
     * Depending on whether this is a public page or not, supply the correct
     * rating orderBy.
     */
    function ratingOrderBy() {
      if (vm.isPublic) {
        return '-combined_rating';
      }

      return '-rating';
    }

    /**
     * Display all of the user's recipes matching the given string.
     */
    function search(searchString) {
      var searchParams = '';
      if (searchString !== undefined) {
        searchParams = '?search=' + searchString;
      }
      $http.get(vm.recipeUrl + searchParams)
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
