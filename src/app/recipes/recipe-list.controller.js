;(function() {  // IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RecipeListController', RecipeListController);

  RecipeListController.$inject =
    ['$location', '$rootScope', '$routeParams', 'dataService', 'recipeService'];

  function RecipeListController(
      $location,
      $rootScope,
      $routeParams,
      dataService,
      recipeService
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

    var localUser = vm.isPublic ? 'public' : $rootScope.username;
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
      // Attempt to get the recipes for this user from the cache
      vm.recipes = recipeService.getRecipes(localUser);
      // If full set of orders not in the cache, get them from the API
      if (vm.recipes.length <= 1) {
        dataService.get(recipesUrl)
          .then(function(response) {
            vm.recipes = recipeService.cacheRecipes(response.data);
          });
      }
    }

    /**
     * Brew a recipe in the list.
     */
    function listBrewIt(id) {
      $location.path("/" + localUser + "/" + id + "/brewit/");
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
          dataService.get(publicUrl + recipeId + '/')
            .then(function(response) {
              recipeService.cacheRecipes(response.data);
              vm.recipes = recipeService.getRecipes('public');
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
          vm.recipes = recipeService.cacheRecipes(response.data);
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
