;(function(){//IIFE

angular.module('brewKeeper')
      .controller('brewIt', function($scope, $http, $routeParams, $location, $route, $rootScope){
        $(document).scrollTop(0);
        var id = $routeParams.id;
        var username =$routeParams.username;
        $scope.username = $routeParams.username;

        //load the data if the page is manually reset
        window.onload = function(){
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + "/")
            .then(function(response){
              $rootScope.detail = response.data;
              $rootScope.steps = response.data.steps;
              $rootScope.notes = response.data.brewnotes;
              var stepArray = []; //create an array of step #'s'
              for(step in $rootScope.steps){
                stepArray.push($rootScope.steps[step].step_number)
              };
              $rootScope.stepArray = stepArray;
              $scope.stepTotal = stepArray.length;

              });
          $scope.resetBrew();
        }


        var stepArray = [] //create an array of step #'s'
        for(step in $rootScope.steps){
          stepArray.push($rootScope.steps[step].step_number)
        };
        $rootScope.stepArray = stepArray;
        $scope.stepTotal = stepArray.length;

        var timerRunning = false //logic for brew timer
        //start brew function
        $scope.startBrew = function(brewCount){
          if(timerRunning){
            return;
          }
          // $("timer.delay").addClass("hidden");
          $("."+$scope.stepArray[0]).addClass("current-step").siblings("div").addClass("inactive");
          // $(".").addClass("inactive");
          $("timer."+$scope.stepArray[0]).removeClass("hidden");
          // $('timer')[0].start();
          $('timer')[1].start();
          timerRunning = true;
        };

        //runs when brew again button pushed
        $scope.reStartBrew = function(){
          if(timerRunning){
            return;
          }
          $("timer.delay").removeClass("hidden");
          $(".step").addClass("inactive")
          $("button.restart-brew").addClass("hidden");
          $("button.add-brew-note").addClass("hidden");
          $("button.reset-brew").removeClass("hidden");
          $('timer')[0].start();
        }

        // $scope.stopBrew = function(){
        //   console.log("pause button pressed");
        //   $scope.$broadcast('timer-stop');
        // }; //This can be used to pause process if needed.

        $scope.resetBrew = function(){
          // $("timer.delay").addClass("hidden");
          $("div.hidden").removeClass("hidden");
          $(".current-step").removeClass("current-step");
          $scope.$broadcast('timer-reset');
          $("button.restart-brew").removeClass("hidden");
          $("button.add-brew-note").removeClass("hidden");
          $("button.reset-brew").addClass("hidden");
          $(".inactive").removeClass("inactive");

          timerRunning = false;

          //getting the data again solves the timers not
          //resetting correctly
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
            .then(function(response){
              $scope.detail = response.data;
              $scope.steps = response.data.steps;
              $scope.notes = response.data.brewnotes;
              $scope.countdownVal = response.data.total_duration;
            })
        };

        // $scope.finishBrew = function(id){
        //   $scope.nextStep(id);
        //   $("."+id).removeClass("current-step");
        //   $("."+id).addClass("hidden")
        // };
        $scope.nextStep = function(stepNumber, brewCount){
          var nextStepIndex = $scope.stepArray.indexOf(stepNumber) + 1;
          var nextStep = $scope.stepArray[nextStepIndex];
          var prevStep = $scope.stepArray[nextStepIndex - 2]
          var nextTimerId = $scope.stepArray.indexOf(stepNumber) + 2;
          if(nextStepIndex >= $scope.steps.length){
            //end of brew countdown
            $scope.resetBrew();
            //update brew_count
            var recipe = {};
            recipe.brew_count = brewCount + 1;
            // brewCount++; //increment brew counter
            $http.patch('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/', recipe);
            return
          }
          $("."+ stepNumber).removeClass("current-step").addClass("inactive");
          $("div.delay").addClass("hidden");
          $("."+ prevStep).addClass("hidden");
          $("."+ stepNumber).addClass("inactive");
          $("timer."+nextStep).removeClass("hidden");
          $("."+ nextStep).addClass("current-step").removeClass("inactive");
          $('timer')[nextTimerId].start();
        };

      $scope.brewnote = { }
      $scope.addBrewNote=function(){
        $http.post('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/brewnotes/', $scope.brewnote)
        .success(function (data) {
          var id = data.id
        })
      $scope.brewnote = { };
      }//Add Brew Note Form

      $(".add-brew-note").on('click', function() {
        $(".brew-form").removeClass("hidden");
      })
      $(".save-note").on('click', function() {
        $(".brew-form").addClass("hidden");
      });//Add hidden class to brewNote form on submit
      $(".cancel-note").on('click', function() {
        $(".brew-form").addClass("hidden");
      });//Cancel BrewNote form
    })


})();//END Angular IIFE
