(function() {  // IFEE
  'use strict';

  angular
    .module('app.recipe.create')
    .controller('RecipeCreationController', RecipeCreationController);

  RecipeCreationController.$inject = ['$location', '$rootScope', 'dataService'];

  function RecipeCreationController($location, $rootScope, dataService) {
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
          // Clear the form
          vm.recipe = {};
          // Navigate to the new recipe
          $location.path('/users/' + $rootScope.username + '/recipes/' + data.id);
        });
    }
  }
})();
