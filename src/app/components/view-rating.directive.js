(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .directive('viewRating', viewRating);

  function viewRating() {
    var directive = {
      restrict: 'A',
      template: '<ul class="rating read-only">' +
          '<li ng-repeat="star in stars" ng-class="star.show">' +
          '\u2605' +
          '</li>' +
          '</ul>',
      scope: {
          ratingValue: '=',
          max: '=',
      },
      link: linkFunc
    };

    return directive;

    /**
     * Display stars with ratingValue stars filled.
     */
    function linkFunc(scope, elem, attrs) {
      scope.stars = [];
      for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            show: {
              filled: i < scope.ratingValue
            }
          });
      }
    }
  }
})();
