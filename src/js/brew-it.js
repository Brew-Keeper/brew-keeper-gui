;(function(){//IIFE

angular.module('brewKeeper')
      .controller('brewIt', function($scope, $http, $routeParams){
        // console.log("firing brewIt controller")
          var id = $routeParams.id;
          $http.get('api/users/1/recipes/'+ id + '/recipe.json')
            .then(function(response){
              $scope.detail = response.data;
              $scope.steps = response.data.steps;
              $scope.notes = response.data.brewnotes;
            })
          //start brew function
          $scope.startBrew = function(){
            console.log("starting brew");
            steps = $scope.steps.length;
            console.log("steps = " + steps);
            $scope.$broadcast('timer-add-cd-seconds', $scope.detail.total_duration)
            }
      }) // end brewIt controller

})();//END Angular IIFE
