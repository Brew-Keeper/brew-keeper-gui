;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('MainController', function($http, $scope, $route, $routeParams, $location, $cookies, $rootScope) {
      var vm = this;
      $rootScope.changePassword = false;
      vm.logout = logout;

      activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

      /**
       * Prepare the page.
       */
      function activate() {
        // Definition of baseUrl (will eventually move to dataService)
        // $rootScope.baseUrl = 'https://brew-keeper-api.herokuapp.com';
        $rootScope.baseUrl = 'http://dev.brewkeeper.com:8000';
        $rootScope.maxStars = 5;
        var cookie = $cookies.get("Authorization");
        $http.defaults.headers.common = {"Authorization": cookie};

        $http.get($rootScope.baseUrl + '/api/whoami/')
          .then(function(response) {
            // If the user still has valid credentials, ensure rootScope has
            // their username
            $rootScope.username = response.data.username;
          })
          .catch(function(error) {
            // TODO: Make sure that the error was not a timeout
            $rootScope.username = null;
            $cookies.remove("Authorization");
            $http.defaults.headers.common = {};
            if ($location.path() == "/reset-pw" || "/login" || "/info") {
              return;
            }
            $location.path('/public');
          }); //.error

        // Show/hide hamburger
        $(".menu").on('click', function() {
          $('.menu').toggleClass("active");
        });

        // Hide the menu if the user clicks somewhere not on the menu
        $(document).on('click', function(e) {
          if (!$(e.target).is('.menu.active')) {
            $('.menu').removeClass("active");
          }
        });
      }

      /**
       * Log the user out, updating what is visible in the UI.
       */
      function logout() {
        var logoutHeader = {"Authorization": $cookies.get("Authorization")};
        $rootScope.changePassword = false;

        // Log the user out of the back-end API
        $http.post($rootScope.baseUrl + '/api/logout/', logoutHeader)
          .then(function() {
            $rootScope.username = null;
            $cookies.remove("Authorization");
            $http.defaults.headers.common = {};
          });
      }
    }) //END MainController

    .controller('WhoAmIController', function($location, $http, $scope, $rootScope, $cookies) {
      $http.get($rootScope.baseUrl + '/api/whoami/')
        .then(function(response){
          $rootScope.username = response.data.username;
          $location.path('/' + $rootScope.username);
        })//.success
        .catch(function(error) {
          // TODO: Don't clear data if the error is a timeout
          $rootScope.username = null;
          $cookies.remove("Authorization");
          $http.defaults.headers.common = {};
          $location.path('/public');
        }); //.error
    }); //END WhoAmIController
})();
