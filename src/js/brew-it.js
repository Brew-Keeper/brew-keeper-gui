;(function(){//IIFE

angular.module('brewKeeper')
      .controller('brewIt', function($scope, $http, $routeParams, $location, $route, $rootScope){
        $(document).scrollTop(0);
        var id = $routeParams.id;
        var username =$routeParams.username;
        $scope.username = $routeParams.username;

        $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
          .then(function(response){
            $scope.detail = response.data;
            $scope.steps = response.data.steps;
            $scope.notes = response.data.brewnotes;
            $scope.countdownVal = response.data.total_duration;
          });

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
          //Shrink countdown time 50%
          // Fade countdown timer to gray

          //Fadde step 1 to green
          //Grow step 1 200%
 // $(this).prev().animate({height:0, opacity:0.5}, 1000);
 // $(this).next().addClass('ondeck').animate({height:200, opacity:1}, 1000);
 // $(this).addClass('active').animate({height:100, opacity:0.5}, 1000)

          $("."+$scope.stepArray[0]).addClass("current-step").removeClass("inactive-step");
          $("div.delay").addClass("inactive-step").animate({height: 0}, 1000, function(){
            $("div.delay").addClass("hidden")
          });
          $(".delay timer").addClass("hidden");
          $("timer."+$scope.stepArray[0]).removeClass("hidden");//Show's timer for active step
          $('timer')[1].start();
          timerRunning = true;
        };

        //runs when brew again button pushed
        $scope.reStartBrew = function(){
          if(timerRunning){
            return;
          }
          $("timer.delay").removeClass("hidden");
          $(".step").addClass("inactive-step")
          $("a[href].restart-brew").addClass("hidden");
          $("a[href].add-brew-note").addClass("hidden");
          $("a[href].reset-brew").removeClass("hidden");
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
          $("a[href].restart-brew").removeClass("hidden");
          $("a[href].add-brew-note").removeClass("hidden");
          $("a[href].reset-brew").addClass("hidden");
          $(".inactive-step").removeClass("inactive-step");

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

//hide all info except step name and of 5
          $("timer."+stepNumber).addClass("hidden");
          $(".minimize-after."+stepNumber).addClass("hidden");

//Change next step to green  and grow next step to 200
          $("timer."+nextStep).removeClass("hidden");

        $("div.step."+ stepNumber).prev().animate({height:0}, 1000).addClass("finished-step").removeClass("current-step");
        $("."+ nextStep).animate({height:200}, 1000, function(){
          $("."+ nextStep).addClass("current-step").removeClass("inactive-step");
          $(".minimize-after."+stepNumber).addClass("hidden")
        });

        $("."+ stepNumber).animate({height:0}, 1000, function(){
          $("."+ stepNumber).removeClass("active-step").addClass("finished-step");
          $(".minimize-after."+stepNumber).addClass("hidden")
        });

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
        $(".brew-form").removeClass("hidden");
      })
      $(".save-note").on('click', function() {
        $(".brew-form").addClass("hidden");
      });//Add hidden class to brewNote form on submit
      $(".cancel-note").on('click', function() {
        $(".brew-form").addClass("hidden");
      });//Cancel BrewNote form


    }) //end brewit controller
})();//END Angular IIFE
