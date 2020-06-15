(function() {
  'use strict';

  angular
    .module('app')
    .config(config);

  config.$inject = ['$compileProvider'];

  function config($compileProvider) {
    // Disable debug
    $compileProvider.debugInfoEnabled(false);
  }
})();
