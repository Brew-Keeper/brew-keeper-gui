;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeList', function($scope, $http, $routeParams, $window){
          var username = $routeParams.username;
          // var userInfo = JSON.parse($window.sessionStorage["userInfo"])
          // console.log("here is the user info: "+userInfo)
          // console.log(typeof(userInfo))
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/')
            .then(function(response){
              $scope.recipes = response.data;
              $scope.username = username;
            })
      })


})();//END IFEE
