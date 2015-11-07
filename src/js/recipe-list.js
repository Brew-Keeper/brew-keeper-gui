;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeList', function($rootScope, $scope, $http, $routeParams){
          var username = $routeParams.username;
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/')
            .then(function(response){
              $scope.recipes = response.data;
              $scope.username = username;
            })
          $scope.listBrewIt = function(username, id){
            console.log("brew-it button pressed");
            console.log(username +"  "+ id);
            $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
              .success(function(){
                console.log("got the data")
              })
              .then(function(response){
                $rootScope.detail = response.data;
                $rootScope.steps = response.data.steps;
              })
          }//end listBrewit function

      })//end controller




})();//END IFEE

// ng-href="#/users/{{username}}/recipes/{{recipe.id}}/brewit"
