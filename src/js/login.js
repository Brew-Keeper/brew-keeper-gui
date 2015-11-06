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
  // console.log("killing cookies")
  // $cookies.remove("Authorization")
  // console.log($cookies.get("Authorization"))
    // var userInfo;
    // $cookies.put("Authorization", "Token 17af9302daa37f79bfac3beb1266b5622b533984");
    // console.log(JSON.stringify($cookies.get("Authorization")));
    // console.log($cookies.getAll());
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
      //  $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
      //   console.log(userInfo);
        $scope.users = {};
        // return $window.sessionStorage["userInfo"]
      })
    }//submit function
  })//CONTROLLER FOR LOGIN

.controller('logoutCtrl', function($scope, $http, $cookies){//CONTROLLER FOR LOGOUT
    $scope.user = {
      email: '',
      password: ''
    }
    $scope.submit= function(){
      // $http.delete('https://brew-keeper-api.herokuapp.com/api/register/', $scope.user)
      // console.log($scope.user);
        console.log("LOGOUT!")
        $cookies.remove("Authorization")
        console.log($cookies.get("Authorization"))
        $http.defaults.headers.common = {}
    }
  })//CONTROLLER FOR LOGOUT
})();//END IFFE
