;(function() {//IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RecipeCreationController', RecipeCreationController);

  RecipeCreationController.$inject =
    ['$scope', '$http', '$location', '$rootScope', '$cookies'];

  function RecipeCreationController($scope, $http, $location, $rootScope, $cookies) {
    var vm = this;
    vm.createNew = createNew;
    vm.recipe = {};
    vm.recipe.orientation = "Standard";

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      // Place focus on correct element
      $('.input-focus').focus();

      // Keep track of which fields have been changed
      $(".form-placeholder").on("change", function() {
        $(this).addClass("changed");
      });

      $http.get($rootScope.baseUrl + '/api/whoami/')
        .then(function(response) {
          $rootScope.username = response.data.username;
        })
        .catch(function() {
          $rootScope.username = null;
          $cookies.remove("Authorization");
          $http.defaults.headers.common = {};
          $location.path('/login');
        });
    }

    /**
     * POST the recipe to the API.
     */
    function createNew() {
      $("form-placeholder").removeClass("changed");
      $http.post($rootScope.baseUrl + '/api/users/' + $rootScope.username + '/recipes/', vm.recipe)
        .success(function (data) {
          var id = data.id;
          $location.path('/' + $rootScope.username + '/' + id);
        // Clear the form
        vm.recipe = {};
        });
    }
  }
})();
