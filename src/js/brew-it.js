;(function(){//IIFE

angular.module('brewKeeper')
      .controller('brewIt', function($scope, $http, $routeParams, $location, $route, $rootScope){
        $(document).scrollTop(0);
        var id = $routeParams.id;
        var username =$routeParams.username;
        $scope.username = $routeParams.username;
        $scope.showStars = false;

        $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
          .then(function(response){
            $scope.detail = response.data;
            $scope.steps = response.data.steps;
            $scope.notes = response.data.brewnotes;
            $scope.countdownVal = response.data.total_duration;
            $scope.ratings = [{
                max: 5
            }];
            var stepArray = [] //create an array of step #'s'
            for(step in $scope.steps){
              stepArray.push($scope.steps[step].step_number)
            };
            $scope.stepArray = stepArray;
            $scope.stepTotal = stepArray.length;
          });

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
          $("."+$scope.stepArray[0]).removeClass("inactive-step").addClass("current-step");
            $("div.delay").addClass("hidden").addClass("inactive-step")
          $(".delay timer").addClass("hidden");
          $(".time-" + $scope.countdownVal).addClass("timeline");//timeline
          $("timer."+$scope.stepArray[0]).removeClass("hidden");//Show's timer for active step
          $('timer')[1].start();
          timerRunning = true;
        };

        //runs when brew again button pushed
        $scope.reStartBrew = function(){
          if(timerRunning){
            return;
          }
          $(".countdown").removeClass("hidden");
          $(".brew-form").addClass("hidden");
          $("div.restart").addClass("hidden");
          $(".countdown").removeClass("hidden");
          $("timer.delay").removeClass("hidden");
          $(".step").addClass("inactive-step")
          $("a[href].restart-brew").addClass("hidden");
          $("a[href].add-brew-note").addClass("hidden");
          $("a[href].reset-brew").removeClass("hidden");
          $(".time-" + $scope.countdownVal).removeClass("timeline");//timeline
          $('timer')[0].start();
          $scope.showStars = false;
        }

        $scope.resetBrew = function(){

          $(".current-step").addClass("hidden")
          $("timer.counter").addClass("hidden");
          $(".delay.hidden").removeClass("hidden");
          $(".current-step").removeClass("current-step");
          $(".countdown").removeClass("hidden");
          $("div.countdown").addClass("hidden");
          $(".time-" + $scope.countdownVal).removeClass("timeline");//timeline
          $scope.$broadcast('timer-reset');
          $("a[href].restart-brew").removeClass("hidden");
          $("a[href].add-brew-note").removeClass("hidden");
          // $(".rating").removeClass("hidden");
          $("a[href].reset-brew").addClass("hidden");
          $scope.showStars = true;
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
        }; //end resetBrew


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
          $("timer."+stepNumber).addClass("hidden");// Hide last step
          $("."+stepNumber).addClass("finished").removeClass("current-step");// Hide last step
//Change next step to green  and grow next step to 200
          $("timer."+nextStep).removeClass("hidden");
          $("."+nextStep).addClass("current-step").removeClass("inactive-step");

          $('timer')[nextTimerId].start();
        }; //end nextStep function

      $scope.brewnote = { }
      $scope.addBrewNote=function(){
        $http.post('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/brewnotes/', $scope.brewnote)
        .success(function (data) {
          var id = data.id
        })
      $scope.brewnote = { };
      }//Add Brew Note Form

      $(".add-brew-note").on('click', function() {
        $(".brew-form").toggleClass("hidden");
        $('.input-focus').focus();
      })
      $(".save-note").on('click', function() {
        $(".brew-form").addClass("hidden");
      });//Add hidden class to brewNote form on submit
      $(".cancel-note").on('click', function() {
        $(".brew-form").addClass("hidden");
      });//Cancel BrewNote form

      $scope.rateRecipe = function (rating, id) {
        var newRating = {"rating": rating}
        $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/", newRating)
      }

    }) //end brewit controller
})();//END Angular IIFE
