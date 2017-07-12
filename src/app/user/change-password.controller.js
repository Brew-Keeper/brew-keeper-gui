;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$location', '$rootScope', 'dataService'];

  function ChangePasswordController($location, $rootScope, dataService) {
    var vm = this;
    vm.generalError = false;
    vm.requestReset = requestReset;
    vm.resetError = false;
    vm.resetPassword = resetPassword;
    vm.resetSuccess = false;
    vm.submitChangePassword = submitChangePassword;
    vm.users = {
      username: $rootScope.username
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
      vm.resetError = false;
      vm.resetSuccess = false;
      vm.generalError = false;

      dataService.post('/api/get-reset/', vm.users)
        .then(successCallbackRequestReset, errorCallbackRequestReset);

      function errorCallbackRequestReset() {
        // TODO: Convert to modal?
        vm.generalError = true;
      }

      function successCallbackRequestReset(response) {
        if (response.data) {
          vm.resetError = true;
          return;
        }

        vm.resetSuccess = true;
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

      dataService.post('/api/reset-pw/', vm.users)
        .then(successCallbackResetPassword, errorCallbackResetPassword);

      function errorCallbackResetPassword(response) {
        // TODO: What is this error handling mechanism, and why is it used
        // here and not other places?
        $rootScope.errorMessage = response.data;
      }

      function successCallbackResetPassword(response) {
        authToken = "Token " + response.data.token;
        dataService.setCredentials(authToken);

        // Reset the users property and navigate to the root of the app
        vm.users = {};
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

      vm.users.username = $rootScope.username;

      dataService.post('/api/change-pw/', vm.users)
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
        vm.users = {};
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
})();
