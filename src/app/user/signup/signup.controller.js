(function() {  // IIFE
  'use strict';

  angular
    .module('app.user')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['$location', '$rootScope', 'dataService'];
  
  function SignupController($location, $rootScope, dataService) {
    var vm = this;
    vm.users = {};
    vm.register = register;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      // Focus on the username field
      $("input[name='username']").focus();

      // Hide mismatch error when user acknowledges
      $("#pw-mismatch-btn").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("#pw-mismatch-modal").addClass("inactive");
      });

      // Hide welcome modal when user acknowledges
      $("#welcome-modal-btn").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("#welcome-modal").addClass("inactive");
      });
    }

    /**
     * If passwords match, attempt to create the user.
     *
     * @param {boolean} mismatch Were the two passwords entered different?
     */
    function register(mismatch) {
      if (mismatch) {
        // Show password mismatch error
        $(".wrapper").addClass("openerror");
        $("#pw-mismatch-modal").removeClass("inactive");
        return;
      }

      dataService.post('/api/register/', vm.users)
        .then(successCallback, errorCallback);

      function errorCallback(response) {
        // TODO: Replace alert with modal
        if (response.status < 500) {
          alert("Ooh, sorry! That username already exists. " +
            "Please choose a different one.");
        } else {
          alert("Apologies, but we have encountered an error.");
        }
      }

      function successCallback(response) {
        // Set the returned token in the cookies/headers to allow user to remain
        // logged in
        dataService.setCredentials(response.data.token);

        // Set the new username in the rootScope
        $rootScope.username = vm.users.username;

        // Reset the users property and navigate to the root of the app
        vm.users = {};
        $location.path('/');

        // Show welcome modal
        $(".wrapper").addClass("openerror");
        $("#welcome-modal").removeClass("inactive");
      }
    }
  }
})();
