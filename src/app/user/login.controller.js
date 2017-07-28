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

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

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

      // Show change password
      $rootScope.changePassword = true;

      // Reset the users property and navigate to the root of the app
      vm.users = {};
      $location.path('/');
    }
  }
})();
