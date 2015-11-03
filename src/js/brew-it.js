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
            $(".1").addClass("current-step")
            $('timer')[0].start();
            $('timer')[1].start();
            timerRunning = true;
          };
          // $scope.stopBrew = function(){
          //   console.log("pause button pressed");
          //   $scope.$broadcast('timer-stop');
          // };
          $scope.resetBrew = function(){
            $scope.$broadcast('timer-reset');
            $(".hidden").removeClass("hidden");
            $(".current-step").removeClass("current-step");
            timerRunning = false;
          };
          $scope.finishBrew = function(id){
            $scope.nextStep(id);
            $("."+id).removeClass("current-step");
             $("."+id).addClass("hidden")
          };
          $scope.nextStep = function(id){
            var nextId = id + 1;
            if(nextId > $scope.steps.length){
              $scope.resetBrew();
              // timerRunning = false;
              // $(".hidden").removeClass("hidden")
              return
            }
            $("."+ nextId).addClass("current-step");
            $('timer')[nextId].start();
          };
      }) // end brewIt controller

})();//END Angular IIFE
