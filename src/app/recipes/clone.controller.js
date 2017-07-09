;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('CloneController', CloneController);

  CloneController.$inject =
    ['$routeParams', '$location', '$rootScope', 'dataService'];

  function CloneController($routeParams, $location, $rootScope, dataService) {
    var vm = this;
    vm.finishClone = finishClone;
    vm.recipe = null;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      vm.recipeUrl = '/api/users/' + $rootScope.username + '/recipes/' +
        $routeParams.id + '/';

      dataService.get(vm.recipeUrl)
        .then(function(response) {
          vm.recipe = response.data;
        });
    }

    /**
     * Update the clone with user-entered data.
     */
    function finishClone() {
      dataService.patch(vm.recipeUrl, vm.recipe)
        .then(function() {
          $location.path('/'+ $rootScope.username + '/' + $routeParams.id + '/');
        });
    }
  }
})();
