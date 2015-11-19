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

      $scope.search = function(searchString){
        $http.get("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/?search="+searchString)
          .then(function(response){
            $scope.recipes = response.data;
            $scope.rating = 0;
            $scope.ratings = [{
                max: 5
            }];
          })
      } //end search function

  })//end recipe-list controller



  .controller('publicRecipe', function($http, $scope, $rootScope, $location, $routeParams){

    $scope.search = function(searchString){
      $http.get("https://brew-keeper-api.herokuapp.com/api/users/public/recipes/?search="+searchString)
        .then(function(response){
          $scope.recipes = response.data;
          $scope.rating = 0;
          $scope.ratings = [{
              max: 5
          }];
        })
    } //end search function

    if($routeParams.username){
      $scope.search($routeParams.username)
    }
    else {
    $http.get("https://brew-keeper-api.herokuapp.com/api/users/public/recipes/")
      .then(function(response){
        $scope.recipes = response.data;
        $scope.rating = 0;
        $scope.ratings = [{
            max: 5
        }];
      })
    }

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



    $scope.newRating = function(rating, recipeId){
      var newRating = {"public_rating": rating}
      $http.post("https://brew-keeper-api.herokuapp.com/api/users/public/recipes/"+ recipeId + "/ratings/", newRating)
        .then(function(){$http.get("https://brew-keeper-api.herokuapp.com/api/users/public/recipes/")
          .then(function(response){
            $scope.recipes = response.data;
            $scope.rating = 0;
            $scope.ratings = [{
                max: 5
            }];
          })
        })// end http.post
    }//end newRating

    $scope.updateRating = function(rating, ratingId, recipeId){
      var newRating = {"public_rating": rating}
      $http.patch("https://brew-keeper-api.herokuapp.com/api/users/public/recipes/"+ recipeId + "/ratings/" + ratingId + "/", newRating)
    }//end updateRating


  })//end publicRecipe controller

})();//END IFEE
