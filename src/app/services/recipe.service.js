(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .factory('recipeService', recipeService);

  recipeService.$inject = ['$q', '$rootScope', 'dataService'];

  function recipeService($q, $rootScope, dataService) {
    // Initialize the cache
    $rootScope.recipeCache = {};

    var service = {
      cacheRecipes: cacheRecipes,
      clearAllCache: clearAllCache,
      getRecipe: getRecipe,
      getRecipes: getRecipes,
      removeRecipe: removeRecipe,
      sortRecipesBy: sortRecipesBy
    };

    return service;

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Cache the provided recipe(s), overwriting existing.
     *
     * @param {(Object|array)} recipes The recipe or array of recipes to cache.
     *
     * @return {Object[]} The now-cached recipes.
     */
    function cacheRecipes(recipes) {
      // Make sure we have an array
      if (Object.prototype.toString.call(recipes) !== '[object Array]') {
        recipes = [recipes];
      }
      for (var i = 0; i < recipes.length; i++) {
        var recipe_id = recipes[i].id;
        $rootScope.recipeCache[recipe_id] = recipes[i];
      }

      return sortRecipesBy(recipes, 'brew_count');
    }

    /**
     * Clear the the whole cache.
     */
    function clearAllCache() {
      $rootScope.recipeCache = {};
    }

    /**
     * Get the specified recipe. If it is not in the cache, retrieve it from
     * the API. If it is already in the cache, but we need detail and it is not
     * there, get it from the API.
     *
     * @param {number} recipe_id The id of the recipe to be retrieved.
     * @param {string} username The user whose recipe we are getting.
     * @param {boolean} [detail] Do we need full details for this recipe?
     *
     * @return {Object} A promise for the recipe in question.
     */
    function getRecipe(recipe_id, username, detail) {
      // If we don't have the recipe, or we don't have all the detail (test: do
      // we have 'grind'?), go get it
      if (
        !$rootScope.recipeCache.hasOwnProperty(recipe_id) ||
        (
          detail &&
          !$rootScope.recipeCache[recipe_id].hasOwnProperty('grind')
        )
      ) {
        return dataService.get('/api/users/' + username + '/recipes/' + recipe_id + '/')
          .then(function(response) {
            $rootScope.recipeCache[recipe_id] = response.data;
            return $rootScope.recipeCache[recipe_id];
          });
      }

      return $q(function(resolve, reject) {
        resolve($rootScope.recipeCache[recipe_id]);
      });
    }

    /**
     * Get all of the recipes for the given user.
     *
     * @param {string} username The user whose recipes we are getting.
     *
     * @return {Object[]} The matching recipes.
     */
    function getRecipes(username) {
      var ret = [];
      for (var key in $rootScope.recipeCache) {
        if (!$rootScope.recipeCache.hasOwnProperty(key)) {
          continue;
        }
        if ($rootScope.recipeCache[key].username === username) {
          ret.push($rootScope.recipeCache[key]);
        }
      }

      return sortRecipesBy(ret, 'brew_count');
    }

    /**
     * Clear the specified recipe from the cache.
     *
     * @param {number} recipe_id The ID of the recipe to delete.
     */
    function removeRecipe(recipe_id) {
      delete $rootScope.recipeCache[recipe_id];
    }

    /**
     * Sort the provided recipes by the specified property.
     *
     * @param {Object[]} recipes The recipes to sort.
     * @param {string} prop The property name on which to sort.
     * @param {boolean} [ascending] Should the sort be in ascending order?
     *
     * @return {Object[]} The same recipes in the desired order.
     */
    function sortRecipesBy(recipes, prop, ascending) {
      recipes.sort(highestPropertyClosure(prop));
      if (ascending) {
        recipes.reverse();
      }

      return recipes;
    }

    /**
     * Closure to create sort by specified property.
     *
     * @param {string} prop The name of the property to compare.
     *
     * @return {function} The comparison function using 'prop'.
     */
    function highestPropertyClosure(prop) {
      var propCompare = function (a, b) {
        if (a[prop] > b[prop]) {
          return -1;
        }
        if (a[prop] < b[prop]) {
          return 1;
        }
        return 0;
      };

      return propCompare;
    }
  }
})();
