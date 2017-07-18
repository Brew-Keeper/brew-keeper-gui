;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('MainController', MainController)
    .controller('WhoAmIController', WhoAmIController);

  MainController.$inject = [
    '$location',
    '$rootScope',
    'dataService',
    'recipeService'
  ];

  function MainController($location, $rootScope, dataService, recipeService) {
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
      $rootScope.maxStars = 5;
      var cookie = dataService.getCredentials();
      dataService.setCredentials(cookie, true);

      dataService.get('/api/whoami/')
        .then(function(response) {
          // If the user still has valid credentials, ensure rootScope has
          // their username
          $rootScope.username = response.data.username;
        })
        .catch(function(error) {
          // TODO: Make sure that the error was not a timeout
          $rootScope.username = null;
          $rootScope.changePassword = false;
          dataService.clearCredentials();
          recipeService.clearAllCache();
          if ($location.path() == "/reset-pw" || "/login" || "/info") {
            return;
          }
          $location.path('/public');
        });

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
      var cookie = dataService.getCredentials();
      var logoutHeader = {"Authorization": cookie};

      // Log the user out of the back-end API
      dataService.post('/api/logout/', logoutHeader)
        .then(function() {
          $rootScope.username = null;
          $rootScope.changePassword = false;
          dataService.clearCredentials();
          recipeService.clearAllCache();
        });
    }
  }

  WhoAmIController.$inject = ['$location', '$rootScope', 'dataService'];

  function WhoAmIController($location, $rootScope, dataService) {
    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      dataService.get('/api/whoami/')
        .then(function(response) {
          $rootScope.username = response.data.username;
          $location.path('/' + $rootScope.username);
        })
        .catch(function(error) {
          // TODO: Don't clear data if the error is a timeout
          $rootScope.username = null;
          $rootScope.changePassword = false;
          dataService.clearCredentials();
          recipeService.clearAllCache();
          $location.path('/public');
        });
    }
  }
})();
