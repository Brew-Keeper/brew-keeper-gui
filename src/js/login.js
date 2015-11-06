;(function(){ //IIFE for angular
angular.module('brewKeeper')
  .controller('signupController', function($scope, $http){
    $scope.users = {
      username: '',
      password: '',
      email: ''
    }
    $scope.submit = function() {
      $http.post('https://brew-keeper-api.herokuapp.com/api/register/', $scope.users)
      console.log($scope.users)
        $scope.users = { }
    };
  })//CONTROLLER FOR SIGNUP
  .controller('loginCtrl', function($scope, $http, $rootScope, $window){//CONTROLLER FOR LOGIN
    var userInfo;
    $scope.users = {
      username: '',
      password: ''
    }
    $scope.submit= function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/login/', $scope.users)
      .then(function(response) {
        userInfo = {
            Authorization: "Token " + response.data.token
        }
        $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
        console.log(userInfo);
        $scope.login = {};
        return $window.sessionStorage["userInfo"]
      })
    }//submit function
  })//CONTROLLER FOR LOGIN



// .controller('logoutCtrl', function($scope, $http){//CONTROLLER FOR LOGOUT
//     $scope.user = {
//       email: '',
//       password: ''
//     }
//     $scope.submit= function(){
//       $http.delete('https://brew-keeper-api.herokuapp.com/api/register/', $scope.user)
//       console.log($scope.user);
//       $scope.login = {};
//     }
//   })//CONTROLLER FOR LOGOUT
})();//END IFFE
