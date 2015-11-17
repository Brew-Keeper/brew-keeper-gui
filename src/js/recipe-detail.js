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
        // if (window.confirm("Are you sure you want to delete " + $scope.detail.title + "?")){
        $(".wrapper").addClass("openerror");
        $("section.confirm-eliminate-modal").removeClass("inactive");
        $("button.cancel-clone-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.confirm-eliminate-modal").addClass("inactive");
          return;
        })
        $("button.confirm-eliminate-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.confirm-eliminate-modal").addClass("inactive");
          $http.delete('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
            .then(function(){
              $location.path('/'+ username);
            })
        })
      }; //end Eliminate function

      $scope.deleteStep = function(stepNumber, stepId){
        // if (window.confirm("Are you sure you want to delete step " + stepNumber + "?")){
        $(".wrapper").addClass("openerror");
        $("section.confirm-delete-modal").removeClass("inactive");
        $("button.cancel-delete-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.confirm-delete-modal").addClass("inactive");
          return;
        })
        $("button.confirm-delete-fail").on("click", function() {
          $(".wrapper").removeClass("openerror");
          $("section.confirm-delete-modal").addClass("inactive")
          $http.delete("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ stepId + "/")
          .then(function(){
            $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id +'/')
            .then(function(response){
              $scope.steps = response.data.steps;
              if(response.data.steps.length == 0){
                $(".brew-it-button").addClass("hidden");
                $(".no-steps").removeClass("hidden");
              }
            })
          })
        })
      } //end deleteStep function

      // $scope.showSteps = function(stepId){
      //   stepId= "div." + stepId.toString()
      //   $(stepId).removeClass("hidden")
      // };

      $scope.hideEditStep = function(stepId){
        stepId = "div." + stepId.toString();
        $(stepId).toggleClass("hidden")
      };



      $scope.editStep = function(step){
        $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ step.id + "/", step)
          .then(function() {
            // $scope.hideEditStep(step.id)
            // $scope.showEditSteps(step.id)
          });
      } //end editStep function

      $scope.showEditStep = function(stepId){
        stepId = "div." + stepId.toString();
        $(stepId).toggleClass("hidden");
      }

      $scope.increaseStep = function(step){
        if(step.step_number >= $rootScope.steps.length){
          return
        }

        //code to swap the steps manually incase of a slow connection
        // var currentStep = step.step_number - 1
        // var nextStep = step.step_number
        var swapStep = $rootScope.steps[step.step_number - 1]
        $rootScope.steps[step.step_number - 1] = $rootScope.steps[step.step_number]
        $rootScope.steps[step.step_number] = swapStep;
        // end code to swap the steps manually

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
        //code to swap the steps manually incase of a slow connection
        // var currentStep = step.step_number - 1
        // var prevStep = step.step_number - 2
        var swapStep = $rootScope.steps[step.step_number - 1]
        $rootScope.steps[step.step_number - 1] = $rootScope.steps[step.step_number - 2]
        $rootScope.steps[step.step_number - 2] = swapStep;
        // end code to swap the steps manually

        step.step_number--
        $http.patch("https://brew-keeper-api.herokuapp.com/api/users/"+ username +"/recipes/"+ id +"/steps/"+ step.id + "/", step).then(function(){
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/')
            .then(function(response){
              $rootScope.steps = response.data.steps;
            })
        })
      } //end decreaseStep function

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
      $(".wrapper").addClass("openerror");
      $("section.confirm-clone-modal").removeClass("inactive");
      $("button.cancel-clone-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-clone-modal").addClass("inactive");
        return;
      })
        $("button.confirm-clone-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-clone-modal").addClass("inactive");

        var cloneData = {}
        cloneData.title = $scope.detail.title;
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
          $location.path("/"+ username +"/clone/"+ newRecipeId);
        })//end post new recipe
      })
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
        $http.delete("https://brew-keeper-api.herokuapp.com/api/users/"+ username + "/recipes/"+ id + "/brewnotes/" + noteId + "/")
        .then(function(){var id = $scope.id;
        $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + "/")
          .then(function(response){
            $rootScope.notes = response.data.brewnotes;
          })
        })
    }; //end deleteNote function

    $scope.showAddBrewNote = function(){
      $(".brew-form").toggleClass("hidden");
    };

    $scope.addBrewNote=function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id + '/brewnotes/', $scope.brewnote)
      .success(function (data) {
        $(".brew-form").toggleClass("hidden");
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

  $scope.makePublic = function(){ //makes recipes public
    if ($rootScope.steps.length < 1) {
      $(".wrapper").addClass("openerror");
      $("section.steps-modal").removeClass("inactive");
      $("button.steps-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.steps-modal").addClass("inactive");
      })
        return;
    }
      $(".wrapper").addClass("openerror");
      $("section.confirm-modal").removeClass("inactive");
      $("button.cancel-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-modal").addClass("inactive");
        return;
      })
      $("button.confirm-fail").on("click", function() {
      $("section.confirm-modal").addClass("inactive");

      var publicData = {}  //build the recipe
      publicData.title = $scope.detail.title;
      publicData.bean_name = $scope.detail.bean_name;
      publicData.roast = $scope.detail.roast;
      publicData.orientation = $scope.detail.orientation;
      publicData.general_recipe_comment = $scope.detail.general_recipe_comment;
      publicData.grind = $scope.detail.grind;
      publicData.total_bean_amount = $scope.detail.total_bean_amount;
      publicData.bean_units = $scope.detail.bean_units;
      publicData.water_type = $scope.detail.water_type;
      publicData.total_water_amount = $scope.detail.total_water_amount;
      publicData.water_units = $scope.detail.water_units;
      publicData.temp = $scope.detail.temp;
      publicData.steps = [];

      $http.post("https://brew-keeper-api.herokuapp.com/api/users/public/recipes/", publicData).success(function(response){

        newRecipeId = response.id;

        steps = []; //build the steps
        for(step in $scope.detail.steps){
          steps[step] = {};
          steps[step].step_number = $scope.detail.steps[step].step_number;
          steps[step].step_title = $scope.detail.steps[step].step_title;
          steps[step].step_body = $scope.detail.steps[step].step_body;
          steps[step].duration = $scope.detail.steps[step].duration;
          steps[step].water_amount = $scope.detail.steps[step].water_amount;

          $http.post("https://brew-keeper-api.herokuapp.com/api/users/pubic/recipes/"+ newRecipeId +"/steps/", steps[step])//end step post

        } //end for loop to build steps
      }) //end .success for posting new recipe to public

    .then(function(){
      $(".wrapper").addClass("openerror");
      $("section.sharing-modal").removeClass("inactive");
      $("button.sharing-not-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.sharing-modal").addClass("inactive");
      })
    })
      })//end confirm-fail

  }; // end makePublic function
}) //end recipDetail controller

})();//END Angular IFEE
