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
            $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
              .success(function(){
              })
              .then(function(response){
                $rootScope.detail = response.data;
                $rootScope.steps = response.data.steps;
                $location.path("/users/" + username + "/recipes/" + id + "/brewit")
              })
          }//end listBrewit function

      })//end controller




})();//END IFEE

// ng-href="#/users/{{username}}/recipes/{{recipe.id}}/brewit"
