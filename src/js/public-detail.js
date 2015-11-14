;(function(){//IFEE
angular.module('brewKeeper')
  .controller('publicDetail', function($http, $scope, $rootScope, $routeParams, $location){

    var id = $routeParams.id;
    $scope.id = $routeParams.id;
    $(document).scrollTop(0);

    $http.get('https://brew-keeper-api.herokuapp.com/api/users/public/recipes/' + id + "/")
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

    // Function for cloning public recipes
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

      $http.post("https://brew-keeper-api.herokuapp.com/api/users/"+ $rootScope.username +"/recipes/", cloneData).success(function(response){

        newRecipeId = response.id;
        steps = [];
        for(step in $scope.detail.steps){
          steps[step] = {};
          steps[step].step_number = $scope.detail.steps[step].step_number;
          steps[step].step_title = $scope.detail.steps[step].step_title;
          steps[step].step_body = $scope.detail.steps[step].step_body;
          steps[step].duration = $scope.detail.steps[step].duration;
          steps[step].water_amount = $scope.detail.steps[step].water_amount;

          $http.post("https://brew-keeper-api.herokuapp.com/api/users/"+ $rootScope.username +"/recipes/"+ newRecipeId +"/steps/", steps[step])//end step post
        };//end loop to clone steps
      })
      .then(function(){
        $location.path("/"+ $rootScope.username +"/clone/"+ newRecipeId);
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

  }) //end recipDetail controller
})();//END Angular IFEE
