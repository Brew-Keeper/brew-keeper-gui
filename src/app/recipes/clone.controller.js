;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('CloneController', CloneController);

  CloneController.$inject = ['$scope', '$http', '$routeParams', '$location', '$rootScope'];

  function CloneController($scope, $http, $routeParams, $location, $rootScope) {
    var cloneVm = this;
    cloneVm.finishClone = finishClone;
    cloneVm.recipe = null;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      cloneVm.recipeUrl = $rootScope.baseUrl + '/api/users/' + $rootScope.username +
        '/recipes/' + $routeParams.id + '/';

      $http.get(cloneVm.recipeUrl)
        .then(function(response) {
          cloneVm.recipe = response.data;
        });
    }

    /**
     * Update the clone with user-entered data.
     *
     * @param {Object} recipe The user-entered recipe info.
     */
    function finishClone(recipe) {
      $http.patch(cloneVm.recipeUrl, recipe)
        .then(function(){
          $location.path('/'+ $rootScope.username + '/' + $routeParams.id + '/');
        });
    }
  }
})();
