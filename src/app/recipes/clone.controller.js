;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('CloneController', CloneController);

  CloneController.$inject =
    ['$location', '$rootScope', '$routeParams', 'dataService'];

  function CloneController($location, $rootScope, $routeParams, dataService) {
    var vm = this;
    vm.finishClone = finishClone;
    vm.recipe = null;

    var recipeUrl = null;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      recipeUrl = '/api/users/' + $rootScope.username + '/recipes/' +
        $routeParams.id + '/';

      dataService.get(recipeUrl)
        .then(function(response) {
          vm.recipe = response.data;
        });

      // Focus on the 'Title' input
      $("input[name='title']").focus();
    }

    /**
     * Update the clone with user-entered data.
     */
    function finishClone() {
      dataService.patch(recipeUrl, vm.recipe)
        .then(function() {
          $location.path(
            '/users/'+ $rootScope.username + '/recipes/' + $routeParams.id + '/');
        });
    }
  }
})();
