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
      .catch(function(response){
        alert("Please fill out all fields carefully.");
      })//Response if bad signup attempt
    };
  })//END CONTROLLER FOR SIGNUP
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
        $('.login').addClass('hidden')
        $('.logout').removeClass('hidden')
        $location.path('/')
      })
      .catch(function(response){
        console.log(response.data)
         alert("Please enter a valid username and password.")
      })//responses for bad login attempts
    }//submit function
    $('.show-signup').on('click', function(){
      $('.register').removeClass('hidden');
      $('.login').addClass('hidden')
    })//show signup form
  })//END CONTROLLER FOR LOGIN

.controller('logoutCtrl', function($scope, $http, $cookies){//CONTROLLER FOR LOGOUT
    $http.get('https://brew-keeper-api.herokuapp.com/api/whoami/')
      .success(function(){
        $('.login').addClass('hidden')//DELETE?
        $('.register').addClass('hidden')
        $('.logout').removeClass('hidden')
      })// if logged in
      .error(function(){
        $('.login').removeClass('hidden');//when logged out
        // $('.logout').addClass('hidden');
      })
    $scope.user = {
      email: '',
      password: ''
    }
    $scope.submit= function(){
      var logoutHeader = {"Authorization":$cookies.get("Authorization")}
      $http.post('https://brew-keeper-api.herokuapp.com/api/logout/', logoutHeader)
        .then(function(){
          $('.login').removeClass('hidden');//when logged out
          $('.logout').addClass('hidden');
        })
        $cookies.remove("Authorization")
        $http.defaults.headers.common = {}
    }
  })//END CONTROLLER FOR LOGOUT

})();//END IFFE
