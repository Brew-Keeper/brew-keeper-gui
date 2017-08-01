(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper', [
      'ngCookies',
      'ngRoute',
      'timer',
      'validation.match'
    ]);
})();
