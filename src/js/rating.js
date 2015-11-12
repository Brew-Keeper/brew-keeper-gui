;(function(){//IIFE
  angular.module('brewKeeper')

  .directive('starRating', function () {
      return {
          restrict: 'A',
          template: '<ul class="rating">' +
              '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
              '\u2605' +
              // '\u2605' +
              '</li>' +
              '</ul>',
          scope: {
              ratingValue: '=',
              max: '=',
              onRatingSelected: '&'
          },
          link: function (scope, elem, attrs) {

              var updateStars = function () {
                  scope.stars = [];
                  for (var i = 0; i < scope.max; i++) {
                      scope.stars.push({
                          filled: i < scope.ratingValue
                      });
                  }
              };

              scope.toggle = function (index) {
                  scope.ratingValue = index + 1;
                  scope.onRatingSelected({
                      rating: index + 1
                  });
              };

              scope.$watch('ratingValue', function (oldVal, newVal) {
                  if (newVal >=0 ) {
                      updateStars();
                  }
              });
          }
      }
  })

  .directive('showRating', function () {
      return {
          restrict: 'A',
          template: '<ul class="rating">' +
              '<li ng-repeat="star in stars" ng-class="star">' +
              '\u2605' +
              // '\u2605' +
              '</li>' +
              '</ul>',
          scope: {
              ratingValue: '=',
              max: '=',
              onRatingSelected: '&'
          },
          link: function (scope, elem, attrs) {

              var updateStars = function () {
                  scope.stars = [];
                  for (var i = 0; i < scope.max; i++) {
                      scope.stars.push({
                          filled: i < scope.ratingValue
                      });
                  }
              };

              scope.toggle = function (index) {
                  scope.ratingValue = index + 1;
                  scope.onRatingSelected({
                      rating: index + 1
                  });
              };

              scope.$watch('ratingValue', function (oldVal, newVal) {
                  if (newVal >=0 ) {
                      updateStars();
                  }
              });
          }
      }
  })

})();//END Angular IIFE
