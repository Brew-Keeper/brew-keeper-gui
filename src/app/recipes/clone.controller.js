;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('CloneController', CloneController);

  CloneController.$inject = ['$scope', '$http', '$routeParams', '$location', '$rootScope'];

  function CloneController($scope, $http, $routeParams, $location, $rootScope) {
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
      vm.recipeUrl = $rootScope.baseUrl + '/api/users/' + $rootScope.username +
        '/recipes/' + $routeParams.id + '/';

      $http.get(vm.recipeUrl)
        .then(function(response) {
          vm.recipe = response.data;
        });
    }

    /**
     * Update the clone with user-entered data.
     *
     * @param {Object} recipe The user-entered recipe info.
     */
    function finishClone(recipe) {
      $http.patch(vm.recipeUrl, recipe)
        .then(function(){
          $location.path('/'+ $rootScope.username + '/' + $routeParams.id + '/');
        });
    }
  }
})();
