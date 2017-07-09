;(function() {  // IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RecipeCreationController', RecipeCreationController);

  RecipeCreationController.$inject =
    ['$scope', '$location', '$rootScope', '$cookies', 'dataService'];

  function RecipeCreationController($scope, $location, $rootScope, $cookies, dataService) {
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
    }

    /**
     * POST the recipe to the API.
     */
    function createNew() {
      $("form-placeholder").removeClass("changed");
      dataService.post('/api/users/' + $rootScope.username + '/recipes/', vm.recipe)
        .success(function (data) {
          var id = data.id;
          $location.path('/' + $rootScope.username + '/' + id);
        // Clear the form
        vm.recipe = {};
        });
    }
  }
})();
