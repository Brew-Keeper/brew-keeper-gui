;(function(){//IFEE

angular.module('brewKeeper')
  .controller('createNewRecipe', function($scope, $http, $location, $rootScope, $cookies){
    $('.input-focus').focus();
    $scope.recipe = { };
    $scope.recipe.orientation = "Standard";

    $http.get($rootScope.baseUrl + '/api/whoami/')
      .then(function(response){
        var username = response.data.username;
        $rootScope.username = username;
      })//.success

      .catch(function(){
        $rootScope.username = null; //hides login and shows logout
        $cookies.remove("Authorization");
        $http.defaults.headers.common = {};
        $location.path('/login');
      });//.error

    $scope.createNew=function(){
      var username = "";

      $http.get($rootScope.baseUrl + '/api/whoami/')
        .then(function(response){
        $("form-placeholder").removeClass("changed");
          username = response.data.username;
          $http.post($rootScope.baseUrl + '/api/users/' + username + '/recipes/', $scope.recipe)
            .success(function (data) {
              var id = data.id;
              $location.path('/' + username + '/' + id);
            });
        $scope.recipe= { };
      });
    }; //end submit function

    $(".form-placeholder").on("change", function(){
      $(this).addClass("changed");
    });
  });//controller for creating new step

})();//END IFEE
