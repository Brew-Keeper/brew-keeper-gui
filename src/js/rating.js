;(function(){//IIFE
  angular.module('brewKeeper')
  .controller('StarCtrl', ['$scope', function ($scope) {
    var currentRating = 4
      console.log(currentRating)
      $scope.rating = 0;
      $scope.ratings = [{
          current: currentRating,
          max: 5
      }];

      $scope.getSelectedRating = function (rating) {
          console.log("getSelectedRating function");
          console.log(rating)
          var username = $scope.username;
          var id = $scope.id;
          console.log(username);
          console.log(id);
      }
  }])

  .directive('starRating', function () {
      return {
          restrict: 'A',
          template: '<ul class="rating">' +
              '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
              '\u2605' +
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
                  console.log("scope.toggle fired")
                  scope.ratingValue = index + 1;
                  scope.onRatingSelected({
                      rating: index + 1
                  });
                  var newRating = {"rating": scope.ratingValue}
                  // console.log("new rating: " + scope.ratingValue)
                  // console.log(newRating)
                  // scope.getSelectedRating(scope.ratingValue);
              };

              scope.$watch('ratingValue', function (oldVal, newVal) {
                  if (newVal) {
                      updateStars();
                  }
              });
          }
      }
  })


})();//END Angular IIFE
