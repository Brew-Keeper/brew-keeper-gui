;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('SignupController', SignupController);

  SignupController.$inject =
    ['$http', '$cookies', '$location', '$rootScope'];
  
  function SignupController($http, $cookies, $location, $rootScope) {
    var signupVm = this;
    signupVm.users = {};
    signupVm.signupButton = signupButton;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
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
    function signupButton(mismatch) {
      if (mismatch) {
        // Show user mismatch error
        $(".wrapper").addClass("openerror");
        $("section.register-modal").removeClass("inactive");
        return;
      }

      $http.post($rootScope.baseUrl + '/api/register/', signupVm.users)
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
        var userInfo = "Token " + response.data.token;
        $cookies.put("Authorization", userInfo);
        $http.defaults.headers.common = {"Authorization": userInfo};

        // Set the new username in the rootScope
        $rootScope.username = signupVm.users.username;

        // Reset the users property and navigate to the root of the app
        signupVm.users = {};
        $location.path('/');

        // Show welcome modal
        $(".wrapper").addClass("openerror");
        $("section.welcome-modal").removeClass("inactive");
      }
    }
  }
})();
