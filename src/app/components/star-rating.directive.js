;(function() {  // IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .directive('starRating', starRating);

  function starRating() {
    var directive = {
      restrict: 'A',
      template: '<ul class="rating">' +
          '<li ng-repeat="star in stars" ng-class="star.show" ng-click="toggle($index)">' +
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
     * The action to take when a star is clicked.
     */
    function linkFunc(scope, elem, attrs) {
      scope.toggle = function (index) {
          scope.ratingValue = index + 1;
      };

      scope.$watch('ratingValue', function (oldVal, newVal) {
          if (newVal >=0 ) {
              displayStars();
          }
      });

      /**
       * Display stars with ratingValue stars filled.
       */
      function displayStars() {
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
  }
})();
