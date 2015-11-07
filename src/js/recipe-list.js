;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeList', function($rootScope, $scope, $http, $routeParams, $location){
          var username = $routeParams.username;

          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/')
            .then(function(response){
              $scope.recipes = response.data;
              $scope.username = username;
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
            $location.path("/users/" + username + "/recipes/" + id + "/brewit")
            $(document).scrollTop(0);
          }//end listBrewit function

      })//end controller




})();//END IFEE

// ng-href="#/users/{{username}}/recipes/{{recipe.id}}/brewit"
