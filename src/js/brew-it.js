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
              $scope.countdownVal = response.data.total_duration;
            })
          //start brew function
          // $scope.countdownVal = 140;
          $scope.startBrew = function(){
            console.log("starting brew");
            // steps = $scope.steps.length;
            // console.log("steps = " + steps);
            // $scope.$broadcast('timer-clear')
            // $scope.$broadcast('timer-add-cd-seconds', $scope.detail.total_duration)
            $scope.$broadcast('timer-start');
          };
          $scope.stopBrew = function(){
            console.log("pause button pressed");
            $scope.$broadcast('timer-stop');
          };
          $scope.resetBrew = function(timerTime){
            console.log("reset button pressed");
            // console.log(timerTime);
            // $scope.$broadcast('timer-stop');
            $scope.$broadcast('timer-reset');
            // $scope.countdownVal = timerTime;
          };
      }) // end brewIt controller

})();//END Angular IIFE
