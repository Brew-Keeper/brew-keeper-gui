;(function(){//IFEE
angular.module('brewKeeper')
  .controller('publicDetail', function($http, $scope, $rootScope, $routeParams){
    console.log("publicDetail controller")

    var id = $routeParams.id;
    $scope.id = $routeParams.id;
    $(document).scrollTop(0);

    $http.get('https://brew-keeper-api.herokuapp.com/api/users/public/recipes/' + id + "/")
      .then(function(response){
        $rootScope.detail = response.data;
        $rootScope.steps = response.data.steps;
        $rootScope.notes = response.data.brewnotes;
        var currentRating = $rootScope.detail.rating;
        $scope.rating = 0;
        $scope.ratings = [{
            current: currentRating,
            max: 5
        }];

    }) //end http.get



  }) //end recipDetail controller
})();//END Angular IFEE
