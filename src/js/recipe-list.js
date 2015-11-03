;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeList', function($scope, $http, $routeParams){
          var username = $routeParams.username;
          console.log($routeParams.username);
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/')
            .then(function(response){
              $scope.recipes = response.data;
            })
      })


})();//END IFEE
