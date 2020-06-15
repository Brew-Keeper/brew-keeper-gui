(function() {
  'use strict';

  angular
    .module('app', [
      /* Angular modules */
      'ngCookies',
      'ngRoute',
      'timer',
      'validation.match',

      /* Shared modules */
      'app.components',
      'app.services',

      /* Feature areas */
      'app.layout',
      'app.recipe',
      'app.user'
    ]);
})();
