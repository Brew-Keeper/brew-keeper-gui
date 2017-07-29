;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
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
      $("button.password-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.register-modal").addClass("inactive");
      });

      // Hide welcome modal when user acknowledges
      $("button.welcome-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.welcome-modal").addClass("inactive");
      });
    }

    /**
     * If passwords match, attempt to create the user.
     *
     * @param {boolean} mismatch Were the two passwords entered different?
     */
    function register(mismatch) {
      if (mismatch) {
        // Show user mismatch error
        $(".wrapper").addClass("openerror");
        $("section.register-modal").removeClass("inactive");
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
        $("section.welcome-modal").removeClass("inactive");
      }
    }
  }
})();
