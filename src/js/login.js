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
  .controller('loginCtrl', function($scope, $http, $rootScope, $cookies){//CONTROLLER FOR LOGIN
    $scope.users = {
      username: '',
      password: ''
    }
    $scope.submit= function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/login/', $scope.users)
      .then(function(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        console.log($cookies.get("Authorization"))
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.users = {};
      })
    }//submit function
  })//CONTROLLER FOR LOGIN

.controller('logoutCtrl', function($scope, $http, $cookies){//CONTROLLER FOR LOGOUT
    $scope.user = {
      email: '',
      password: ''
    }
    $scope.submit= function(){
      console.log($cookies.get("Authorization"))
      var logoutHeader = {"Authorization":$cookies.get("Authorization")}
      console.log(logoutHeader)
      $http.post('https://brew-keeper-api.herokuapp.com/api/logout/', logoutHeader)
        console.log("LOGOUT!")
        $cookies.remove("Authorization")
        console.log($cookies.get("Authorization"))
        $http.defaults.headers.common = {}
    }
  })//CONTROLLER FOR LOGOUT
})();//END IFFE
