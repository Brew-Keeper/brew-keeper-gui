(function() {  // IIFE
  'use strict';

  angular
    .module('app.user')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider
      .when('/change-password', {
        templateUrl: 'app/user/change-password.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: 'app/user/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .when('/reset-pw', {
        templateUrl: 'app/user/reset-password.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm'
      })
      .when('/send-reset', {
        templateUrl: 'app/user/send-reset.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm'
      })
      .when('/signup', {
        templateUrl: 'app/user/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      });
  }
})();
