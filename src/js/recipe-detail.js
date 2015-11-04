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
                $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id)
                  .then(function(response){
                    $scope.steps = response.data.steps;
                  })
              })
            }
          } //end deleteStep function

          $scope.showEditStep = function(stepId){
            stepId = "div." + stepId.toString();
            $(stepId).removeClass("hidden")
          }

          $scope.editStep = function(step){
            $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ step.id + "/", step)
              .then($scope.showEditStep(step.id))
          } //end editStep function
          $scope.hideEditStep = function(stepId){
            stepId = "div." + stepId.toString();
            $(stepId).addClass("hidden")
          }

          $scope.step = { }//Might need to prepopulate this with empty strings for each key... Maybe...
          $scope.submit=function(){
            $http.post("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/", $scope.step).then(function(){
              $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id)
                .then(function(response){
                  $scope.steps = response.data.steps;
                })
            })
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

        //Function for cloning recipes
        $scope.cloneRecipe = function(){
          var cloneData = {}
          console.log("raw data")
          console.log($scope.detail)
          cloneData.title = $scope.detail.title;
          cloneData.bean_name = $scope.detail.bean_name;
          cloneData.roast = $scope.detail.roast
          cloneData.orientation = $scope.detail.orientation
          cloneData.general_recipe_comment = $scope.detail.general_recipe_comment
          cloneData.grind = $scope.detail.grind
          cloneData.total_bean_amount = $scope.detail.total_bean_amount
          cloneData.bean_units = $scope.detail.bean_units
          cloneData.water_type = $scope.detail.water_type
          cloneData.total_water_amount = $scope.detail.total_water_amount
          cloneData.water_units = $scope.detail.water_units
          cloneData.temp = $scope.detail.temp
          cloneData.steps = []
          console.log("clone data")
          console.log(cloneData)
          // $http.post("https://brew-keeper-api.herokuapp.com/api/users/don.pablo/recipes/", cloneData).success(function(){
          //   console.log("yay success?")
          // });
          steps = []
          for(step in $scope.detail.steps){
            steps[step] = {}
            steps[step].step_number = $scope.detail.steps[step].step_number
            steps[step].step_title = $scope.detail.steps[step].step_title
            steps[step].step_body = $scope.detail.steps[step].step_body
            steps[step].duration = $scope.detail.steps[step].duration
            steps[step].water_amount = $scope.detail.steps[step].water_amount
            $http.post("https://brew-keeper-api.herokuapp.com/api/users/don.pablo/recipes/53/steps/", steps[step]).success(function(){
              console.log("step# "+ steps[step].step_number +" added!")
            });
          }
          // console.log(cloneData.steps)
        }


      }) //end recipDetail controller



})();//END Angular IFEE
