;(function(){ //IIFE for angular
angular.module('brewKeeper')
  .controller('signupController', function($scope, $http, $cookies, $location){
    $scope.users = {
      // username: '',
      // password: '',
      // // email: '',
      // email: ''
    }
    $scope.submit = function() {
      console.log("user signup function called")
      // $http.post('https://brew-keeper-api.herokuapp.com/api/register/', $scope.users)
      // .then(function successCallback(response) {
      //   userInfo = "Token " + response.data.token
      //   $cookies.put("Authorization", userInfo)
      //   $http.defaults.headers.common = {"Authorization": userInfo}
      //   $scope.users = { }
      //   // $('.login').addClass('hidden')
      //   // $('.logout').removeClass('hidden')
      //   $location.path('/')
      // }, function errorCallback(response){
      //   alert("Please fill out all fields carefully.");
      // })//Response if bad signup attempt
    };
  })//END CONTROLLER FOR SIGNUP


  .controller('loginCtrl', function($scope, $http, $rootScope, $cookies, $location){//CONTROLLER FOR LOGIN
    $scope.users = {
      username: '',
      password: ''
    }
    $scope.submit= function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/login/', $scope.users)
      .then(function successCallback(response) {
        userInfo = "Token " + response.data.token
        $cookies.put("Authorization", userInfo)
        $http.defaults.headers.common = {"Authorization": userInfo}
        $scope.users = {};
        //pseudo-code Hide "login/signup" in nav in index.html
        //pseudo-code Hide "form.login" in login.html
        // $('.login').addClass('hidden')
        // //pseudo-code Show "logout" in nav
        //pseudo-code Show "Create New Recipe" in nav
        // $('.logout').removeClass('hidden')
        $location.path('/')
      }, function errorCallback(response){
         alert("Please enter a valid username and password.")
      })//responses for bad login attempts
    }//submit function
    $('.show-signup').on('click', function(){
      $('form.register').removeClass('hidden');
      $('form.login').addClass('hidden')
    })//show signup form
  })//END CONTROLLER FOR LOGIN

})();//END IFFE
