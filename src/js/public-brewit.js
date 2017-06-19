;(function(){//IIFE

angular.module('brewKeeper')
  .controller('public-brewIt', function($scope, $http, $routeParams, $location, $route, $rootScope){

    $(document).scrollTop(0);
    var id = $routeParams.id;
    var ratingId = null;
    var userRating = 0;
    $scope.showStars = false;

    $http.get($rootScope.baseUrl + '/api/users/public/recipes/' + id + '/')
      .then(function(response){
        $scope.detail = response.data;
        $scope.steps = response.data.steps;
        $scope.notes = response.data.brewnotes;
        $scope.countdownVal = response.data.total_duration;
        var currentRating = $scope.detail.average_rating;
        $scope.rating = 0;
        $scope.ratings = [{
            current: currentRating,
            max: 5
        }];

        var stepArray = []; //create an array of step #'s'

        for(var step in $scope.steps){
          stepArray.push($scope.steps[step].step_number);
        }
        $scope.stepArray = stepArray;
        $scope.stepTotal = stepArray.length;

        if($rootScope.username){
          $http.get($rootScope.baseUrl + '/api/users/public/recipes/' + id + '/ratings/')
          .then(function(response){
            var publicRatings = response.data;

              publicRatings.forEach(function(rating){
                if (rating.username == $rootScope.username){
                  ratingId = rating.id;
                  $scope.ratingId = ratingId;
                  userRating = rating.public_rating;
                }
                return userRating, ratingId;
              });

              $scope.userRating = userRating;
              $scope.userRatings = [{
                current: userRating,
                max: 5
              }];
          });
        }//end if(username)
      });//end http.get

      $scope.rateRecipe = function (rating) {
        var newRating = {"public_rating": rating};

        if(!ratingId) { //if the user has not rated, create new rating
          $http.post($rootScope.baseUrl + '/api/users/public/recipes/'+ id + '/ratings/', newRating)
          .then(function(response){ //get the updated rating
            ratingId = response.data.id;
            $scope.ratingId = ratingId;
            $http.get($rootScope.baseUrl + '/api/users/public/recipes/'+ id + '/').then(function(response){
              var currentRating = newRating.public_rating;
              $scope.userRating = newRating.public_rating;
              $scope.userRatings = [{
                  current: currentRating,
                  max: 5
              }];
            });
          });//end .then to get new ratings
        }//end if(!ratingId)

        if(ratingId) { //if the user has already rated, update their current rating
          $http.patch($rootScope.baseUrl + '/api/users/public/recipes/'+ id + '/ratings/' + ratingId + "/", newRating)
          .then(function(response){ //get the updated rating
            ratingId = response.data.id;
            $scope.ratingId = ratingId;
            $http.get($rootScope.baseUrl + '/api/users/public/recipes/'+ id + '/').then(function(response){
              var currentRating = newRating.public_rating;
              $scope.userRating = newRating.public_rating;
              $scope.userRatings = [{
                  current: currentRating,
                  max: 5
              }];
            });
          });//end .then to get new ratings
        } //end if(ratingId)
    }; //end public recipe rating function


      var stepArray = []; //create an array of step #'s'
      for(var step in $rootScope.steps){
        stepArray.push($rootScope.steps[step].step_number);
      }
      $rootScope.stepArray = stepArray;
      $scope.stepTotal = stepArray.length;

      var timerRunning = false; //logic for brew timer

      //start brew function
      $scope.startBrew = function(brewCount){
        if(timerRunning){
          return;
        }
        $("."+$scope.stepArray[0]).removeClass("inactive-step").addClass("current-step");
        $("div.delay").addClass("hidden").addClass("inactive-step");
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
        $("div.restart").addClass("hidden");
        $(".countdown").removeClass("hidden");
        $("timer.delay").removeClass("hidden");
        $(".step").addClass("inactive-step");
        $("a[href].restart-brew").addClass("hidden");
        $("a[href].add-brew-note").addClass("hidden");
        $("a[href].reset-brew").removeClass("hidden");
        $(".time-" + $scope.countdownVal).removeClass("timeline");//timeline
        $('timer')[0].start();
        $scope.showStars = false;
      };

      $scope.resetBrew = function(){
        $(".current-step").addClass("hidden");
        $("timer.counter").addClass("hidden");
        $(".delay.hidden").removeClass("hidden");
        $(".current-step").removeClass("current-step");
        $(".countdown").removeClass("hidden");
        $("div.countdown").addClass("hidden");
        $(".time-" + $scope.countdownVal).removeClass("timeline");//timeline
        $scope.$broadcast('timer-reset');
        $("a[href].restart-brew").removeClass("hidden");
        $("a[href].add-brew-note").removeClass("hidden");
        $("a[href].reset-brew").addClass("hidden");
        $scope.showStars = true;
        timerRunning = false;

        //getting the data again solves the timers not
        //resetting correctly
        $http.get($rootScope.baseUrl + '/api/users/public/recipes/' + id + '/')
          .then(function(response){
            $scope.detail = response.data;
            $scope.steps = response.data.steps;
            $scope.notes = response.data.brewnotes;
            $scope.countdownVal = response.data.total_duration;
          });
      }; //end resetBrew


      $scope.nextStep = function(stepNumber, brewCount){
        var nextStepIndex = $scope.stepArray.indexOf(stepNumber) + 1;
        var nextStep = $scope.stepArray[nextStepIndex];
        var prevStep = $scope.stepArray[nextStepIndex - 2];
        var nextTimerId = $scope.stepArray.indexOf(stepNumber) + 2;
        if(nextStepIndex >= $scope.steps.length){
          //end of brew countdown
          $scope.resetBrew();
          //update brew_count
          var recipe = {};
          recipe.brew_count = brewCount + 1;
          return;
        }
        $("timer."+stepNumber).addClass("hidden");// Hide last step
        $("."+stepNumber).addClass("finished").removeClass("current-step");// Hide last step
//Change next step to green  and grow next step to 200
        $("timer."+nextStep).removeClass("hidden");
        $("."+nextStep).addClass("current-step").removeClass("inactive-step");

        $('timer')[nextTimerId].start();
      }; //end nextStep function


    $(".add-brew-note").on('click', function() {
      $(".brew-form").toggleClass("hidden");
    });
    $(".save-note").on('click', function() {
      $(".brew-form").addClass("hidden");
    });//Add hidden class to brewNote form on submit
    $(".cancel-note").on('click', function() {
      $(".brew-form").addClass("hidden");
    });//Cancel BrewNote form


  }); //end public-brewit controller
})();//END Angular IIFE
