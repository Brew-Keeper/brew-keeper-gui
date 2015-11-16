;(function(){ //IIFE for angular
angular.module('brewKeeper')
  .controller('signupController', function($scope, $http, $cookies, $location){
    $scope.users = {}
    $scope.signupButton = function(mismatch) {
      if(mismatch){
        alert("Passwords Do Not Match")
        return
      }
      $http.post('https://brew-keeper-api.herokuapp.com/api/register/', $scope.users)
      .then(function successCallback(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.users = { }
        $location.path('/')
      }, function errorCallback(response){
        alert("Please fill out all fields carefully.");
      })//Response if bad signup attempt
    };
  })//END CONTROLLER FOR SIGNUP


  .controller('loginCtrl', function($scope, $http, $rootScope, $cookies, $location){//CONTROLLER FOR LOGIN
    $scope.users = {}
    $scope.loginButton= function(){
      $cookies.remove("Authorization")
      $http.defaults.headers.common = {}
      $http.post('https://brew-keeper-api.herokuapp.com/api/login/', $scope.users)
      .then(function successCallback(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.username = $scope.users.username
        $scope.users = {};
        $location.path('/')
      }, function errorCallback(response){
         alert("Please enter a valid username and password.")
      })//responses for bad login attempts
    }//submit function
    $('.show-signup').on('click', function(){
      $('.register').removeClass('hidden');
      $('form.login').addClass('hidden')
    })//show signup form
  })//END CONTROLLER FOR LOGIN

  .controller('changePassword', function($scope, $http, $location){
    var users = {}
    $scope.resetError = false;
    $scope.resetSuccess = false;
    $scope.generalError = false;

    // $scope.users.username = $scope.username;

    $scope.submitChangePassword = function(mismatch){
      if(mismatch){
        alert("Passwords Do Not Match")
        return
      }
      users.username = $scope.username;
      users.old_password = $scope.users.old_password;
      users.new_password = $scope.users.new_password;
      $http.post('https://brew-keeper-api.herokuapp.com/api/change-pw/', users)
        .then(function successCallback(){
          alert("Password Successfully Changed");
          $location.path('/');
        },
        function errorCallback(){
          alert("Current password incorrect, please try again.");
          $scope.users = {};
        })//end http.post to change-pw
    } //end submitChangePassword function

    $('.show-reset').on('click', function(){
      $('.reset-password').removeClass('hidden');
      $('form.login').addClass('hidden')
    });

    $scope.requestReset = function(users){
      $scope.resetError = false;
      $scope.resetSuccess = false;
      $scope.generalError = false;
      $http.post('https://brew-keeper-api.herokuapp.com/api/get-reset/', $scope.users)
        .then(function(response){
          if(response.data){
            $scope.resetError = true;
            return
          };
          $scope.resetSuccess = true;
        })
        .catch(function(){
          $scope.generalError = true;
        })

    };//end reset password function

  })//end changePassword controller
})();//END IFFE
