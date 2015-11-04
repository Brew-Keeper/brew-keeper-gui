;(function(){//IFEE

angular.module('brewKeeper')
  .controller('createNewRecipe', function($scope, $http, $location){
    $scope.recipe = { }//Might need to prepopulate this with empty strings for each key... Maybe...
    $scope.submit=function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/users/don.pablo/recipes/', $scope.recipe)
        // .then(function() {
        // })
        // $resource.get()
        .success(function (data) {
          var id = data.id
          $location.path('/users/don.pablo/recipes/' + id);
        })
    $scope.recipe= { };
  }

  })//controller for creating new step

})();//END IFEE
