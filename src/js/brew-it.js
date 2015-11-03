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
              // $scope.countdownVal = 10;
            })
          //start brew function
          $scope.startBrew = function(id){
            console.log("starting brew");
            // $scope.$broadcast('timer-start');
            // $(".timer").addClass("red");
            // $(".1").addClass("red")
            $('timer')[0].start();
            $('timer')[1].start();
          };
          $scope.stopBrew = function(){
            console.log("pause button pressed");
            $scope.$broadcast('timer-stop');
            // $(".timer").removeClass("red");
          };
          $scope.resetBrew = function(timerTime){
            console.log("reset button pressed");
            $scope.$broadcast('timer-reset');
            $(".timer").removeClass("red");
            // $scope.$broadcast('timer-start');
          };
          $scope.finishBrew = function(id){
            console.log("Brew complete");
            // $(".timer").removeClass("red");
            console.log("id = " + id)
            nextStep(id);
            // $("."+id).removeClass("red");
          };
          nextStep = function(id){
            var nextId = id + 1;
            $('timer')[nextId].start();
          }
      }) // end brewIt controller

})();//END Angular IIFE
