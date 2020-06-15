(function() {
  'use strict';

  angular
    .module('app.user')
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
      // Start focus on appropriate field
      $("input[name='username']").focus();
      if ($location.path() === '/change-password') {
        $("input[name='oldPassword']").focus();
      }

      // Hide mismatch error when user acknowledges
      $("#pw-mismatch-btn").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("#pw-mismatch-modal").addClass("inactive");
      });

      // Hide incorrect password modal after user acknowledges
      $("#incorrect-pw-btn").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("#incorrect-pw-modal").addClass("inactive");
      });

      // Hide password change success modal when user acknowledges
      $("#pw-success-btn").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("#pw-success-modal").addClass("inactive");
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
        // Show password mismatch modal
        $(".wrapper").addClass("openerror");
        $("#pw-mismatch-modal").removeClass("inactive");
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
        dataService.setCredentials(response.data.token);

        // Reset the users property and navigate to the root of the app
        vm.users = {};
        $location.path('/');
      }
    }

    /**
     * If the passwords match, attempt to update password.
     *
     * @param {boolean} mismatch Do the two entered new passwords differ?
     */
    function submitChangePassword(mismatch) {
      if (mismatch) {
        // Show password mismatch modal
        $(".wrapper").addClass("openerror");
        $("#pw-mismatch-modal").removeClass("inactive");
       return;
      }

      vm.users.username = $rootScope.username;

      dataService.post('/api/change-pw/', vm.users)
        .then(successCallbackChangePassword, errorCallbackChangePassword);

      function errorCallbackChangePassword() {
        // Show error changing password modal
        $(".wrapper").addClass("openerror");
        $("#incorrect-pw-modal").removeClass("inactive");

        // Reset users data
        vm.users = {};
      }

      function successCallbackChangePassword() {
        // Show password change success modal
        $(".wrapper").addClass("openerror");
        $("#pw-success-modal").removeClass("inactive");

        // Navigate to the root of the app
        $location.path('/');
      }
    }
  }
})();
