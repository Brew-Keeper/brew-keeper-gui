;(function(){//IFEE

angular.module('brewKeeper')
  .controller('recipeList', function($rootScope, $scope, $http, $routeParams, $location){


      var username = $routeParams.username;

      $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/')
        .then(function(response){
          $scope.recipes = response.data;
          $scope.username = username;

          $scope.ratings = [{
              max: 5
          }];
        })

      $scope.listBrewIt = function(username, id){
        //get indexOf recipe id
        for (var index = 0; index < $scope.recipes.length; index ++) {
          if($scope.recipes[index].id == id){
            var recipeId = index;
          }
        }
        $rootScope.steps = $scope.recipes[recipeId].steps;
        $rootScope.detail = $scope.recipes[recipeId];
        $location.path("/" + username + "/" + id + "/brewit")
        $(document).scrollTop(0);
      }//end listBrewit function

      $scope.rateRecipe = function (rating, id) {
        var newRating = {"rating": rating}
        $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/", newRating)
      }

  })//end recipe-list controller

  .controller('publicRecipe', function($http, $scope, $rootScope, $location){
    // `console.log("publicRecipe controller")
    // console.log($scope.username)`

    $http.get("https://brew-keeper-api.herokuapp.com/api/users/public/recipes/")
      .then(function(response){
        $scope.recipes = response.data;
        $scope.ratings = [{
            max: 5
        }];
      })

      $scope.publicListBrewIt = function(id){
        //get indexOf recipe id
        for (var index = 0; index < $scope.recipes.length; index ++) {
          if($scope.recipes[index].id == id){
            var recipeId = index;
          }
        }
        $rootScope.steps = $scope.recipes[recipeId].steps;
        $rootScope.detail = $scope.recipes[recipeId];
        $location.path("/public/" + id + "/brewit")
        $(document).scrollTop(0);
      }//end listBrewit function

  })//end publicRecipe controller




})();//END IFEE

// ng-href="#/users/{{username}}/recipes/{{recipe.id}}/brewit"
