;(function() {  //IIFE for angular
  'use strict';

  angular
    .module('brewKeeper')
    .controller('LoginController', LoginController)
    .controller('changePassword', ChangePasswordController);

  LoginController.$inject = ['$scope', '$http', '$rootScope', '$cookies', '$location', 'userService'];

  function LoginController($scope, $http, $rootScope, $cookies, $location, userService) {
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

      // Save the username to the userService
      userService.setUsername(loginVm.users.username);

      // Reset the users property and navigate to the root of the app
      loginVm.users = {};
      $location.path('/');
    }
  }



  ChangePasswordController.$inject = ['$scope', '$http', '$location', '$cookies', '$rootScope', 'userService'];

  function ChangePasswordController($scope, $http, $location, $cookies, $rootScope, userService) {
    var changePwdVm = this;
    changePwdVm.generalError = false;
    changePwdVm.requestReset = requestReset;
    changePwdVm.resetError = false;
    changePwdVm.resetPassword = resetPassword;
    changePwdVm.resetSuccess = false;
    changePwdVm.submitChangePassword = submitChangePassword;
    changePwdVm.users = {
      username: userService.username()
    };

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      // Hide register mismatch modal when user acknowledges
      $("button.password-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.register-modal").addClass("inactive");
      });

      // Hide password change success modal when user acknowledges
      $("button.change-not-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.successful-modal").addClass("inactive");
      });

      // Show the password reset form
      $('a.reset').on('click', function() {
        $('.reset-password').removeClass('hidden');
        $('form.login').addClass('hidden');
      });

      // Show login form when "Login" is clicked
      $(".login-link").click(function() {
        $('section.register').addClass('hidden');
        $('section.reset-password').addClass('hidden');
        $('form.login').removeClass('hidden');
      });
    }

    /**
     * Submit the entered username for password reset.
     */
    function requestReset() {
      // Reset the flags
      changePwdVm.resetError = false;
      changePwdVm.resetSuccess = false;
      changePwdVm.generalError = false;

      $http.post($rootScope.baseUrl + '/api/get-reset/', changePwdVm.users)
        .then(successCallbackRequestReset, errorCallbackRequestReset);

      function errorCallbackRequestReset() {
        // TODO: Convert to modal?
        changePwdVm.generalError = true;
      }

      function successCallbackRequestReset(response) {
        if (response.data) {
          changePwdVm.resetError = true;
          return;
        }

        changePwdVm.resetSuccess = true;
      }
    }

    /**
     * If the passwords match, attempt to update password.
     *
     * @param {boolean} mismatch Were the two passwords entered different?
     */
    function resetPassword(mismatch) {
      if (mismatch) {
        // TODO: Convert to modal
        alert("Passwords Do Not Match");
        return;
      }

      $http.post($rootScope.baseUrl + '/api/reset-pw/', changePwdVm.users)
        .then(successCallbackResetPassword, errorCallbackResetPassword);

      function errorCallbackResetPassword(response) {
        // TODO: What is this error handling mechanism, and why is it used
        // here and not other places?
        $rootScope.errorMessage = response.data;
      }

      function successCallbackResetPassword(response) {
        userInfo = "Token " + response.data.token;
        $cookies.put("Authorization", userInfo);
        $http.defaults.headers.common = {"Authorization": userInfo};

        // Reset the users property and navigate to the root of the app
        changePwdVm.users = {};
        $location.path('/');
      }
    }

    /**
     * If the passwords match, attempt to update password.
     *
     * @param {boolean} mismatch Were the two passwords entered different?
     */
    function submitChangePassword(mismatch) {
      if (mismatch) {
        // Show register mismatch modal
        $(".wrapper").addClass("openerror");
        $("section.register-modal").removeClass("inactive");
       return;
      }

      // TODO: How do we get the username? From $rootScope? userService.
      changePwdVm.users.username = $scope.username;

      $http.post($rootScope.baseUrl + '/api/change-pw/', changePwdVm.users)
        .then(successCallbackChangePassword, errorCallbackChangePassword);

      function errorCallbackChangePassword() {
        // FIXME: This appears to be undefined!!!!!!
        // Show error changing password modal
        $(".wrapper").addClass("openerror");
        $("section.password-modal").removeClass("inactive");

        // Hide error changing password modal after user acknowledges
        $("button.password-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.password-modal").addClass("inactive");
        });

        // Reset users data
        changePwdVm.users = {};
      }

      function successCallbackChangePassword() {
        // Show password change success modal
        $(".wrapper").addClass("openerror");
        $("section.successful-modal").removeClass("inactive");

        // Navigate to the root of the app
        $location.path('/');
      }
    }
  }
})();//END IFFE
