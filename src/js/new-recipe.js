;(function(){//IFEE

angular.module('brewKeeper')
  .controller('createNewRecipe', function($scope, $http, $location){
    $scope.recipe = { }
    $scope.recipe.orientation = "Standard";

    $scope.createNew=function(){
      var username = ""
      $http.get('https://brew-keeper-api.herokuapp.com/api/whoami/')
        .then(function(response){
        $("form-placeholder").removeClass("changed")

          username = response.data.username;
          $http.post('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/', $scope.recipe)
            .success(function (data) {
              var id = data.id
              $location.path('/users/' + username + '/recipes/' + id);
            })
        $scope.recipe= { };
      })
  } //end submit function

  $(".form-placeholder").on("change", function(){
    $(this).addClass("changed");
  })
  })//controller for creating new step

})();//END IFEE
