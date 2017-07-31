;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('LoginController', LoginController);

  LoginController.$inject = [
    '$location',
    '$rootScope',
    'dataService',
    'recipeService'];

  function LoginController($location, $rootScope, dataService, recipeService) {
    var vm = this;
    vm.login = login;
    vm.users = {};

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

      // Hide invalid login modal after user acknowledges
      $("#invalid-login-btn").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("#invalid-login-modal").addClass("inactive");
      });
    }

    /**
     * What to do in case an error occurs during login.
     *
     * @param {Object} response The api response data.
     */
    function errorCallbackLogin(response) {
      // Show invalid login modal
      $(".wrapper").addClass("openerror");
      $("#invalid-login-modal").removeClass("inactive");
    }

    /**
     * Submit login info to API. Show success or failure flow depending on
     * result.
     */
    function login() {
      dataService.clearCredentials();
      recipeService.clearAllCache();
      dataService.post('/api/login/', vm.users)
        .then(successCallbackLogin, errorCallbackLogin);
    }

    /**
     * What to do once the user logs in.
     *
     * @param {Object} response The api response data.
     */
    function successCallbackLogin(response) {
      dataService.setCredentials(response.data.token);

      // Save the username to the rootScope
      $rootScope.username = vm.users.username;

      // Reset the users property and navigate to the root of the app
			// TODO: Parse `target` query param; redirect to it if it exists
			vm.users = {};
      $location.path('/');
    }
  }
})();
