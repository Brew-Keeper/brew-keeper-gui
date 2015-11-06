;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeList', function($scope, $http, $routeParams){
          var username = $routeParams.username;
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/')
            .then(function(response){
              $scope.recipes = response.data;
              $scope.username = username;
            })
          $scope.listBrewIt = function(username, id){
            console.log("brew-it button pressed");

          }
      })//end controller




})();//END IFEE

// ng-href="#/users/{{username}}/recipes/{{recipe.id}}/brewit"
