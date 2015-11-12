;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeDetail', function($scope, $http, $location, $routeParams, $rootScope){
          var id = $routeParams.id;
          var username = $routeParams.username;
          $scope.username = $routeParams.username;
          $scope.id = $routeParams.id;
          $(document).scrollTop(0);

          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + "/")
            .then(function(response){
              $rootScope.detail = response.data;
              $rootScope.steps = response.data.steps;
              $rootScope.notes = response.data.brewnotes;
              var currentRating = $rootScope.detail.rating;
              $scope.rating = 0;
              $scope.ratings = [{
                  current: currentRating,
                  max: 5
              }];

          }) //end http.get


          $scope.rateRecipe = function (rating) {
            var newRating = {"rating": rating}
            $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/", newRating)
          }


          $scope.EliminateRecipe = function() {
            if (window.confirm("Are you sure you want to delete " + $scope.detail.title + "?")){
              $http.delete('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/').then(function(){
                $location.path('/users/'+ username);
              })
            };
          }; //end Eliminate function

          $scope.showSteps = function(stepId){
            stepId= "article." + stepId.toString()
            $(stepId).toggleClass("hidden")
          };

          $scope.showEditStep = function(stepId){
            stepId = "div." + stepId.toString();
            $(stepId).toggleClass("hidden");
          }

          $scope.deleteStep = function(stepNumber, stepId){
            if (window.confirm("Are you sure you want to delete step " + stepNumber + "?")){
              $http.delete("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ stepId + "/").then(function(){
                $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id +'/')
                  .then(function(response){
                    $scope.steps = response.data.steps;
                    if(response.data.steps.length == 0){
                      $(".brew-it-button").addClass("hidden");
                      $(".no-steps").removeClass("hidden");
                    }
                  })
              })
            }
          } //end deleteStep function



          $scope.editStep = function(step){
            $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ step.id + "/", step)
              .then(function() {
                $scope.hideEditStep(step.id)
                $scope.showEditStep(step.id)
              });
          } //end editStep function

          $scope.increaseStep = function(step){
            if(step.step_number >= $rootScope.steps.length){
              return
            }
            step.step_number++
            $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ step.id + "/", step).then(function(){
              $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
                .then(function(response){
                  $rootScope.steps = response.data.steps;
                })
            })
          } //end increaseStep function


          $scope.decreaseStep = function(step){
            if(step.step_number <= 1){
              return
            }
            step.step_number--
            $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ step.id + "/", step).then(function(){
              $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
                .then(function(response){
                  $rootScope.steps = response.data.steps;
                })
            })
          } //end decreaseStep function

          $scope.hideEditStep = function(stepId){
            stepId = "div." + stepId.toString();
            $(stepId).addClass("hidden")
          }

          $scope.step = { }//Might need to prepopulate this with empty strings for each key... Maybe...
          $scope.addStep=function(){ //add step function
            $scope.step.step_number = $scope.steps.length + 1;
            $http.post("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/", $scope.step).then(function(){
              $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
                .then(function(response){
                  $(".brew-it-button").removeClass("hidden");
                  $(".no-steps").addClass("hidden");
                  $rootScope.steps = response.data.steps;
                })
            })
            $scope.step= { };
          } //end new step submit function

        $scope.showAddSteps = function(){
          $("form.create-new-step").toggleClass("hidden");
        };//Reveal "Add Step" when new recipe form is submitted.
        // $scope.hideAddSteps = function(){
        //   $("form.create-new-step").addClass("hidden");
        //   $("button.done-adding").addClass("hidden");
        // }; //hides the add step form

        $('.edit-button').on('click', function(){
          $('.edit-recipe').removeClass("hidden");
          $('.recipe-view').addClass("hidden");
        });

        $(".no-steps").click(function(){
          $scope.showAddSteps()
        })

      $scope.editRecipe = function(recipe){
        $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/", recipe)
        .then( function () {
          $('.edit-recipe').addClass("hidden");
          $('.recipe-view').removeClass("hidden");
        })
      } //end editRecipe function
        $('.cancel-recipe-edit').on('click', function(){
          $('.recipe-view').removeClass("hidden");
          $('.edit-recipe').addClass("hidden");
        });

        // Function for cloning recipes
        $scope.cloneRecipe = function(){
          if (!window.confirm("Are you sure you want to clone "+ $scope.detail.title +" ?")){
            return;
          };
          var cloneData = {}
          cloneData.title = "Clone of: " + $scope.detail.title;
          cloneData.bean_name = $scope.detail.bean_name;
          cloneData.roast = $scope.detail.roast;
          cloneData.orientation = $scope.detail.orientation;
          cloneData.general_recipe_comment = $scope.detail.general_recipe_comment;
          cloneData.grind = $scope.detail.grind;
          cloneData.total_bean_amount = $scope.detail.total_bean_amount;
          cloneData.bean_units = $scope.detail.bean_units;
          cloneData.water_type = $scope.detail.water_type;
          cloneData.total_water_amount = $scope.detail.total_water_amount;
          cloneData.water_units = $scope.detail.water_units;
          cloneData.temp = $scope.detail.temp;
          cloneData.steps = [];

          $http.post("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/", cloneData).success(function(response){

            newRecipeId = response.id;
            steps = [];
            for(step in $scope.detail.steps){
              steps[step] = {};
              steps[step].step_number = $scope.detail.steps[step].step_number;
              steps[step].step_title = $scope.detail.steps[step].step_title;
              steps[step].step_body = $scope.detail.steps[step].step_body;
              steps[step].duration = $scope.detail.steps[step].duration;
              steps[step].water_amount = $scope.detail.steps[step].water_amount;

              $http.post("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ newRecipeId +"/steps/", steps[step])//end step post
            };//end loop to clone steps
          })
          .then(function(){
            $location.path("/users/"+ username +"/clone/"+ newRecipeId);
          })//end post new recipe
        }; //end recipe clone function

        $scope.showEditNote = function(noteId) {
          noteView = "div.note-view" + noteId.toString();
          editNote = "article.edit-note" + noteId.toString();
          $(noteView).addClass("hidden")
          $(editNote).removeClass("hidden")
        }
          // $scope.showEditStep = function(stepId){
          //   stepId = "div." + stepId.toString();
          //   $(stepId).removeClass("hidden")
          // }

        $scope.editNote = function(note){
          var note_id = note.id
          $http.put("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/brewnotes/" + note_id + "/", note)
          .then( function () {
            $(editNote).addClass("hidden");
            $(noteView).removeClass("hidden");
          })
        } //end editNote function

        $scope.deleteNote = function(noteId) {
          var noteId = noteId
          if (window.confirm("Are you sure you want to delete this note?")){
            $http.delete("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/brewnotes/" + noteId + "/")
            .then(function(){var id = $scope.id;
            $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + "/")
              .then(function(response){
                $rootScope.notes = response.data.brewnotes;
              })
            })
          };
        }; //end deleteNote function

        $scope.showAddBrewNote = function(){
          $(".brew-form").toggleClass("hidden");
        };

        $scope.addBrewNote=function(){
          $http.post('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/brewnotes/', $scope.brewnote)
          .success(function (data) {
            var id = $scope.id;
            $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + "/")
              .then(function(response){
                $rootScope.notes = response.data.brewnotes;
              })
          })
        $scope.brewnote = { };
        $scope.addNote = false;
        }//Add Brew Note Form

        $scope.showNoteIcons = function(noteId){
          $(".note-icons").filter($("."+ noteId)).toggleClass("hidden");
        }


      }) //end recipDetail controller



})();//END Angular IFEE
