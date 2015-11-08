;(function(){ //IIFE for angular
angular.module('brewKeeper')
  .controller('signupController', function($scope, $http, $cookies, $location){
    $scope.users = {
      username: '',
      password: '',
      email: '',
      email: ''
    }
    $scope.submit = function() {
      $http.post('https://brew-keeper-api.herokuapp.com/api/register/', $scope.users)
      .then(function(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.users = { }
        $location.path('/')

      })
    };
  })//CONTROLLER FOR SIGNUP
  .controller('loginCtrl', function($scope, $http, $rootScope, $cookies, $location){//CONTROLLER FOR LOGIN
    $scope.users = {
      username: '',
      password: ''
    }
    $scope.submit= function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/login/', $scope.users)
      .then(function(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.users = {};
        $location.path('/')
      })
    }//submit function
  })//CONTROLLER FOR LOGIN

.controller('logoutCtrl', function($scope, $http, $cookies){//CONTROLLER FOR LOGOUT
    $scope.user = {
      email: '',
      password: ''
    }
    $scope.submit= function(){
      var logoutHeader = {"Authorization":$cookies.get("Authorization")}
      $http.post('https://brew-keeper-api.herokuapp.com/api/logout/', logoutHeader)
        $cookies.remove("Authorization")
        $http.defaults.headers.common = {}
    }
  })//CONTROLLER FOR LOGOUT

        // $('.login').addClass('hidden');//when logged in
        // $'.register').addClass('hidden');
        // $('.logout').removeClass('hidden');
        //
        // $('.login').removeClass('hidden');//when logged out
        // $'.register').removeClass('hidden');
        // $('.logout').addClass('hidden');

})();//END IFFE
