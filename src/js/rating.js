;(function(){//IIFE
  angular.module('brewKeeper')
  .controller('StarCtrl', ['$scope', function ($scope) {
    // var currentRating = $rootScope.recipe.rating;
      // var currentRating = 4;
      // console.log(currentRating)
      // $scope.rating = 0;
      // $scope.ratings = [{
      //     current: currentRating,
      //     max: 5
      // }];
      //
      // $scope.getSelectedRating = function (rating) {
      //     console.log("getSelectedRating function");
      //     console.log(rating)
      //     var username = $scope.username;
      //     var id = $scope.id;
      //     console.log(username);
      //     console.log(id);
      // }
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
                      console.log("stars " + i)
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
                  // var newRating = {"rating": scope.ratingValue}
              };

              scope.$watch('ratingValue', function (oldVal, newVal) {
                  console.log("scope.$watch")
                  console.log("oldVal " + oldVal)
                  console.log("newVal " + newVal)
                  if (newVal >=0 ) {
                      console.log("calling updateStars function")
                      updateStars();
                  }
              });
          }
      }
  })


})();//END Angular IIFE
