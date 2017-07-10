;(function() {  // IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RecipeListController', RecipeListController);

  RecipeListController.$inject =
    ['$rootScope', '$routeParams', '$location', 'dataService'];

  function RecipeListController(
    $rootScope,
    $routeParams,
    $location,
    dataService
  ) {
    var vm = this;
    vm.isPublic = ($location.path().indexOf('/public') === 0);
    vm.listBrewIt = listBrewIt;
    vm.newRating = newRating;
    vm.rateRecipe = rateRecipe;
    vm.ratingOrderBy = ratingOrderBy;
    vm.ratings = [{max: $rootScope.maxStars}];
    vm.recipes = [];
    vm.search = search;
    vm.updateRating = updateRating;

    var publicUrl = '/api/users/public/recipes/';
    var recipesUrl = null;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      if (vm.isPublic) {
        recipesUrl = publicUrl;
        if ($routeParams.username) {
          // If provided, show the public recipes for the specified user
          vm.search($routeParams.username);
          return;
        }
      } else {
        recipesUrl = '/api/users/' + $rootScope.username + '/recipes/';
      }
      // Get the recipes for this user
      dataService.get(recipesUrl)
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
      // Ensure that we only take this action on public recipes
      if (!vm.isPublic) {
        return;
      }
      var providedRating = {"public_rating": rating};
      dataService.post(publicUrl + recipeId + '/ratings/', providedRating)
        // Now that we have posted, update the rating to reflect the change
        .then(function() {
          dataService.get(publicUrl)
            .then(function(response) {
              vm.recipes = response.data;
            });
        });
    }

    /**
     * Rate a recipe in the list.
     */
    function rateRecipe(rating, id) {
      // Ensure that we only take this action on private recipes
      if (vm.isPublic) {
        return;
      }
      var newRating = {"rating": rating};
      dataService.patch(recipesUrl + id + '/', newRating);
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
     * Display all of the user's recipes matching the given string. If no
     * string is given, get all of the recipes at the recipes url.
     */
    function search(searchString) {
      var searchParams = '';
      if (searchString !== undefined) {
        searchParams = '?search=' + searchString;
      }
      dataService.get(recipesUrl + searchParams)
        .then(function(response) {
          vm.recipes = response.data;
        });
    }

    /**
     * Update an existing public rating.
     */
    function updateRating(rating, ratingId, recipeId) {
      // Ensure that we only take this action on public recipes
      if (!vm.isPublic) {
        return;
      }
      var providedRating = {"public_rating": rating};
      dataService.patch(
        publicUrl + recipeId + '/ratings/' + ratingId + '/',
        providedRating);
    }
  }
})();
