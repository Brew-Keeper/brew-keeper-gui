(function() {  // IIFE
  'use strict';

  angular
    .module('app', [
      /* Angular modules */
      'ngCookies',
      'ngRoute',
      'timer',
      'validation.match',

      /* Feature areas */
      'app.brew',
      'app.layout',
      'app.recipes',
      'app.user'
    ]);
})();
