;(function() {  //IIFE for angular
  'use strict';

  angular
    .module('brewKeeper')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$http', '$rootScope', '$cookies', '$location'];

  function LoginController($scope, $http, $rootScope, $cookies, $location) {
    var loginVm = this;
    loginVm.loginButton = loginButton;
    loginVm.users = {};

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      // Register
      $('a.show-register').on('click', function() {
        $('section.register').removeClass('hidden');
        $('form.register').removeClass('hidden');
        $('form.login').addClass('hidden');
      });//show signup form

      // About Creators
      $(".keeper-clicker").on('click', function() {
        $(".more-info").addClass("hidden");
        $(".about-creators").removeClass("hidden");
      });

      // Extended Creators Info
      $("a[href].about").on('click', function() {
        $(".more-info").removeClass("hidden");
        $(".about-creators").addClass("hidden");
      });
    }

    /**
     * What to do in case an error occurs during login.
     *
     * @param {Object} response The api response data.
     */
    function errorCallbackLogin(response) {
      // Show register mismatch modal test
      $(".wrapper").addClass("openerror");
      $("section.login-modal").removeClass("inactive");
      $("button.login-fail").on("click", function() {
        // Hide register mismatch modal text
        $(".wrapper").removeClass("openerror");
        $("section.login-modal").addClass("inactive");
      });
    }

    /**
     * Submit login info to API. Show success or failure flow depending on
     * result.
     */
    function loginButton() {
      $cookies.remove("Authorization");
      $http.defaults.headers.common = {};
      $http.post($rootScope.baseUrl + '/api/login/', loginVm.users)
        .then(successCallbackLogin, errorCallbackLogin);
    }

    /**
     * What to do once the user logs in.
     *
     * @param {Object} response The api response data.
     */
    function successCallbackLogin(response) {
      var userInfo = "Token " + response.data.token;
      $cookies.put("Authorization", userInfo);
      $http.defaults.headers.common = {"Authorization": userInfo};

      // Save the username to the rootScope
      $rootScope.username = loginVm.users.username;

      // Show change password
      $rootScope.changePassword = true;

      // Reset the users property and navigate to the root of the app
      loginVm.users = {};
      $location.path('/');
    }
  }
})();//END IFFE
