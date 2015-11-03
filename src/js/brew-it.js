;(function(){//IIFE

angular.module('brewKeeper')
      .controller('brewIt', function($scope, $http, $routeParams){
          var id = $routeParams.id;
          $http.get('api/users/1/recipes/'+ id + '/recipe.json')
            .then(function(response){
              $scope.detail = response.data;
              $scope.steps = response.data.steps;
              $scope.notes = response.data.brewnotes;
              $scope.countdownVal = response.data.total_duration;
            })

            var timerRunning = false //logic for brew timer
          //start brew function
          $scope.startBrew = function(id){
            if(timerRunning){
              return;
            }
            $(".1").addClass("red")
            $('timer')[0].start();
            $('timer')[1].start();
            timerRunning = true;
          };
          // $scope.stopBrew = function(){
          //   console.log("pause button pressed");
          //   $scope.$broadcast('timer-stop');
          // };
          $scope.resetBrew = function(timerTime){
            $scope.$broadcast('timer-reset');
            $(".hidden").removeClass("hidden");
            $(".red").removeClass("red");
            timerRunning = false;
          };
          $scope.finishBrew = function(id){
            nextStep(id);
            $("."+id).removeClass("red");
             $("."+id).addClass("hidden")
          };
          nextStep = function(id){
            var nextId = id + 1;
            if(nextId > $scope.steps.length){
              timerRunning = false;
              $(".hidden").removeClass("hidden")
              return
            }
            $("."+ nextId).addClass("red");
            $('timer')[nextId].start();
          };
      }) // end brewIt controller

})();//END Angular IIFE
