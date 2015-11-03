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
              // $scope.countdownVal = response.data.total_duration;
              $scope.countdownVal = 10;
            })
          //start brew function
          $scope.startBrew = function(){
            console.log("starting brew");
            $scope.$broadcast('timer-start');
            $(".timer").addClass("red")
          };
          $scope.stopBrew = function(){
            console.log("pause button pressed");
            $scope.$broadcast('timer-stop');
          };
          $scope.resetBrew = function(timerTime){
            console.log("reset button pressed");
            $scope.$broadcast('timer-reset');
            // $scope.$broadcast('timer-start');
          };
          $scope.finishBrew = function(){
            console.log("Brew complete");
            $(".timer").removeClass("red")
          }
      }) // end brewIt controller

})();//END Angular IIFE
