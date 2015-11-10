;(function(){//IIFE
  angular.module('brewKeeper')
    .controller('cloneController', function($scope, $http, $routeParams, $location){
      console.log("cloneController engaged")
      var id = $routeParams.id;
      var username = $routeParams.username;
      console.log(username, id)
      // var recipe = {};
      // $scope.recipe = recipe;
      // $scope.recipe.title = "test";
      $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
        .then(function(response){
          $scope.recipe = response.data;
          console.log(response.data)
          // $scope.recipe.bean_units = "Medium"
        })

      $scope.finishClone = function(recipe){
        console.log("submit button pressed")
        $http.patch('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/', recipe)
          .then(function(){
            console.log("cloned")
            $location.path("/users/"+ username + "/recipes/" + id + "/")
          })
      }//end finishClone function

    }) //end cloneController



})();//END Angular IIFE
