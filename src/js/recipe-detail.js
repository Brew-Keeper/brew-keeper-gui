;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeDetail', function($scope, $http, $location, $routeParams){
          // console.log("firing the recipeDetail controller")
          var id = $routeParams.id;
          var username = $routeParams.username;
          $scope.username = $routeParams.username;

          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id)
            .then(function(response){
              $scope.detail = response.data;
              $scope.steps = response.data.steps;
              $scope.notes = response.data.brewnotes;
            })

          $scope.Eliminate = function() {
            if (window.confirm("Are you sure you want to delete " + $scope.detail.title + "?")){
              $http.delete('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/').then(function(){
                $location.path('/users/'+ username);
              })
            };
          }; //end Eliminate function

          $scope.showSteps = function(stepId){
            stepId= "p." + stepId.toString()
            $(stepId).toggleClass("hidden")
          };

          $scope.showNotes = function(){
            $("div.notes").toggleClass("hidden")
          };
          $scope.deleteStep = function(stepNumber, stepId){
            if (window.confirm("Are you sure you want to delete step " + stepNumber + "?")){
              $http.delete("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ stepId + "/").then(function(){
                controller: 'recipeDetail'
              })
            }
          } //end deleteStep function

          $scope.showEditStep = function(stepId){
            stepId = "form." + stepId.toString();
            $(stepId).toggleClass("hidden")
          }

          $scope.editStep = function(step){
            $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ step.id + "/", step)
              .then($scope.showEditStep(step.id))
          } //end editStep function

          })//recipeDetail controller

      .controller('createNewStep', function($scope, $http, $routeParams){
        var id = $routeParams.id;
        var username = $routeParams.username;
        $scope.username = $routeParams.username;
        $scope.step = { }//Might need to prepopulate this with empty strings for each key... Maybe...

        $scope.submit=function(){
          $http.post("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/", $scope.step)
          $scope.step= { };
        } //end new step submit function



        $scope.showAddSteps = function(){
          $("form.create-new-step").removeClass("hidden");
          $("button.done-adding").removeClass("hidden");
        };//Reveal "Add Step" when new recipe form is submitted.
        $scope.hideAddSteps = function(){
          $("form.create-new-step").addClass("hidden");
          $("button.done-adding").addClass("hidden");
        }; //hides the add step form
      }) //end createNewStep controller



})();//END Angular IFEE
