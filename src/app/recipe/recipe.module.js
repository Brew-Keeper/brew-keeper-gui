(function() {  // IIFE
  'use strict';

  angular
    .module('app.recipe', [
      /* Submodules */
      'app.recipe.brew',
      'app.recipe.clone',
      'app.recipe.create',
      'app.recipe.detail',
      'app.recipe.list'
      ]);
})();
