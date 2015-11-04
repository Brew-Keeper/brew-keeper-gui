;(function(){//IIFE

angular.module('brewKeeper')
      .controller('brewIt', function($scope, $http, $routeParams, $location, $route){
          var id = $routeParams.id;
          var username =$routeParams.username;
          $scope.username = $routeParams.username;
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id)
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
          // }; //This can be used to pause process if needed.

          $scope.resetBrew = function(){

            $("div.hidden").removeClass("hidden");
            $(".current-step").removeClass("current-step");
            $scope.$broadcast('timer-reset');
            timerRunning = false;
            // $location.path("/users/"+ username + "/recipes/" + id + "/brewit")
            // $route.reload()
            $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id)
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

          $scope.nextStep = function(id){
            var nextId = id + 1;
            if(nextId > $scope.steps.length){
              $scope.resetBrew();
              return
            }
            $("."+id).removeClass("current-step");
            $("."+id).addClass("hidden");
            $("."+ nextId).addClass("current-step");
            $('timer')[nextId].start();
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
