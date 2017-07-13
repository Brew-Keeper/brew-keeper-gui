;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .factory('recipeService', recipeService);

  recipeService.$inject = ['$rootScope', 'dataService'];

  function recipeService($rootScope, dataService) {
    // Initialize the cache
    $rootScope.recipeCache = {};

    var service = {
      cacheRecipes: cacheRecipes,
      clearAllCache: clearAllCache,
      clearUserCache: clearUserCache,
      getRecipe: getRecipe,
      getRecipes: getRecipes,
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
     * @param {string} username The user to whom the recipes belong.
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

      return sortRecipesBy(recipes, 'rating');
    }

    /**
     * Clear the the whole cache.
     */
    function clearAllCache() {
      $rootScope.recipeCache = {};
    }

    /**
     * Clear the cache of the specified user.
     *
     * @param {string} username The user to whom the recipes belong.
     */
    function clearUserCache(username) {
      for (var key in $rootScope.recipeCache) {
        if (!$rootScope.recipeCache.hasOwnProperty(key)) {
          continue;
        }
        if ($rootScope.recipeCache[key].username === username) {
          $rootScope.recipeCache[key] = undefined;
        }
      }
    }

    /**
     * Get the specified recipe.
     *
     * @param {number} recipe_id The id of the recipe to be retrieved.
     * @param {string} username The user whose recipe we are getting.
     *
     * @return {Object} The recipe in question.
     */
    function getRecipe(recipe_id, username) {
      // If we don't have the recipe, go get it
      if (!$rootScope.hasOwnProperty(recipe_id)) {
        dataService.get('/api/users/' + username + '/recipes/' + recipe_id + '/')
          .then(function(response) {
            $rootScope.recipeCache[recipe_id] = response.data;
          });
      }

      return $rootScope.recipeCache[recipe_id];
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

      return sortRecipesBy(ret, 'rating');
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
