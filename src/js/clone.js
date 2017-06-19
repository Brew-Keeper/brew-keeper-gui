;(function(){//IIFE
  angular.module('brewKeeper')
    .controller('cloneController', function($scope, $http, $routeParams, $location, $rootScope){
      var id = $routeParams.id;
      var username = $routeParams.username;

      $http.get($rootScope.baseUrl + '/api/users/' + username + '/recipes/' + id + '/')
        .then(function(response){
          $scope.recipe = response.data;
        });

      $scope.finishClone = function(recipe){
        $http.patch($rootScope.baseUrl + '/api/users/' + username + '/recipes/' + id + '/', recipe)
          .then(function(){
            $location.path("/"+ username + "/" + id + "/");
          });
      }; //end finishClone function

    }); //end cloneController

})();//END Angular IIFE
