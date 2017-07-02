;(function() {  //IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('recipeList', RecipeListController)
    .controller('publicRecipe', PublicRecipeController);

  RecipeListController.$inject =
    ['$rootScope', '$scope', '$http', '$routeParams', '$location'];

  function RecipeListController($rootScope, $scope, $http, $routeParams, $location) {
    var vm = this;
    vm.listBrewIt = listBrewIt;
    vm.rateRecipe = rateRecipe;
    vm.ratings = [{ max: 5 }];
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
     * Brew the selected recipe.
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

    function rateRecipe(rating, id) {
      var newRating = {"rating": rating};
      $http.patch(vm.recipeUrl + id + '/', newRating);
    }

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

    $scope.search = function(searchString){
      $http.get($rootScope.baseUrl + '/api/users/public/recipes/?search=' + searchString)
        .then(function(response){
          $scope.recipes = response.data;
          $scope.rating = 0;
          $scope.ratings = [{
              max: 5
          }];
        });
    }; //end search function

    if($routeParams.username){
      $scope.search($routeParams.username);
    }
    else {
    $http.get($rootScope.baseUrl + '/api/users/public/recipes/')
      .then(function(response){
        $scope.recipes = response.data;
        $scope.rating = 0;
        $scope.ratings = [{
            max: 5
        }];
      });
    }

    $scope.publicListBrewIt = function(id){
      //get indexOf recipe id
      var recipeId;
      for (var index = 0; index < $scope.recipes.length; index ++) {
        if($scope.recipes[index].id == id){
          recipeId = index;
        }
      }
      $rootScope.steps = $scope.recipes[recipeId].steps;
      $rootScope.detail = $scope.recipes[recipeId];
      $location.path("/public/" + id + "/brewit");
      $(document).scrollTop(0);
    };//end listBrewit function



    $scope.newRating = function(rating, recipeId){
      var newRating = {"public_rating": rating};
      $http.post($rootScope.baseUrl + '/api/users/public/recipes/' + recipeId + '/ratings/', newRating)
        .then(function(){$http.get($rootScope.baseUrl + '/api/users/public/recipes/')
          .then(function(response){
            $scope.recipes = response.data;
            $scope.rating = 0;
            $scope.ratings = [{
                max: 5
            }];
          });
        });// end http.post
    };//end newRating

    $scope.updateRating = function(rating, ratingId, recipeId){
      var newRating = {"public_rating": rating};
      $http.patch($rootScope.baseUrl + '/api/users/public/recipes/' + recipeId + '/ratings/' + ratingId + '/', newRating);
    };//end updateRating

  }//end publicRecipe controller
})();
