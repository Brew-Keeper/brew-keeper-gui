;(function(){//IFEE

angular.module('brewKeeper')
  .controller('createNewRecipe', function($scope, $http, $location){
    $scope.recipe = { }
    $scope.recipe.orientation = "Standard";
    $scope.submit=function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/', $scope.recipe)
        // .then(function() {
        // })
        // $resource.get()
        .success(function (data) {
          var id = data.id
          $location.path('/users/' + username + '/recipes/' + id);
        })
    $scope.recipe= { };
  }

  })//controller for creating new step

})();//END IFEE
