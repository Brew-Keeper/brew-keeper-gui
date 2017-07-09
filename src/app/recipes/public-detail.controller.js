;(function() {  // IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('publicDetail', PublicDetailController);

  PublicDetailController.$inject =
    ['$rootScope', '$routeParams', '$location', 'dataService'];

  function PublicDetailController(
    $rootScope,
    $routeParams,
    $location,
    dataService
  ) {
    $rootScope.clonePublicRecipe = clonePublicRecipe;

    var vm = this;
    vm.addBrewNote = addBrewNote;
    vm.comments = [];
    vm.deleteComment = deleteComment;
    vm.editComment = editComment;
    vm.rateRecipe = rateRecipe;
    vm.ratingId = null;
    vm.showAddBrewNote = showAddBrewNote;
    vm.showCloneRecipe = showCloneRecipe;
    vm.showEditNote = showEditNote;
    vm.showNoteIcons = showNoteIcons;
    vm.userRating = null;
    vm.userRatings = [{max: $rootScope.maxStars}];

    var recipeUrl = '/api/users/public/recipes/'+ $routeParams.id + '/';
    var ratingsUrl = recipeUrl + 'ratings/';
    var commentsUrl = recipeUrl + 'comments/';

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    function activate() {
      $(document).scrollTop(0);

      dataService.get(recipeUrl)
        .then(function(response) {
          vm.detail = response.data;
          vm.steps = response.data.steps;
          var currentRating = vm.detail.average_rating;
          vm.comments = response.data.public_comments;
          vm.ratings = [{
              current: currentRating,
              max: 5
          }];

          if ($rootScope.username) {
            dataService.get(ratingsUrl)
              .then(function(response) {
                var publicRatings = response.data;
                publicRatings.forEach(function(rating) {
                  if (rating.username == $rootScope.username) {
                    vm.ratingId = rating.id;
                    vm.userRating = rating.public_rating;
                  }
                  return;
                });
                vm.userRatings = [{
                  current: vm.userRating,
                  max: $rootScope.maxStars
                }];
              });
          }
        });

      addListeners();
    }

    /**
     * Add a public brew note.
     */
    function addBrewNote() {
      dataService.post(commentsUrl, vm.comment)
        .success(function (data) {
          $(".brew-form").toggleClass("hidden");
          dataService.get(recipeUrl)
            .then(function(response){
              vm.comments = response.data.public_comments;
            });
        });
      vm.comment = {};
    }

    /**
     * Add the listeners needed for this controller.
     */
    function addListeners() {
      // Close the confirm clone modal if user cancels
      $("button.cancel-clone-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-clone-modal").addClass("inactive");
        return;
      });
    }

    /**
     * Delete the logged-in user's comment from this public recipe.
     */
    function deleteComment(commentId) {
      dataService.delete(commentsUrl + commentId + '/')
        .then(function() {
          for (var i = 0; i < vm.comments.length; i++) {
            if (vm.comments[i].id == commentId) {
              // We have identified the key of the comment to delete
              vm.comments.splice(i, 1);
              break;
            }
          }
        });
    }

    /**
     * Edit the logged-in user's comment on this public recipe.
     */
    function editComment(comment) {
      dataService.put(commentsUrl + comment.id + '/', comment)
        .then(function() {
          $("article.edit-note" + comment.id).addClass("hidden");
          $("div.note-view" + comment.id).removeClass("hidden");
        });
    }
 
    /**
     * Rate this public recipe.
     */
    function rateRecipe(rating) {
      var newRating = {"public_rating": rating};
      // TODO: userRating is probably cruft
      vm.userRating = rating;
      vm.userRatings = [{
          current: currentRating,
          max: 5
      }];

      // If the user has already rated, update their current rating
      if (vm.ratingId) {
        dataService.patch(ratingsUrl + vm.ratingId + '/', newRating);
      }

      // If the user has not rated, create new rating
      if (!vm.ratingId) {
        dataService.post(recipeUrl + 'ratings/', newRating)
          .then(function(response) {
            vm.ratingId = response.data.id;
          });
      }
    }

    /**
     * Show the form for adding a brew note.
     */
    function showAddBrewNote() {
      $(".brew-form").toggleClass("hidden");
    }

    /**
     * Show the clone recipe modal. The cloneRecipe method is defined in the
     * RecipeDetailController.
     */
    function showCloneRecipe() {
      $(".wrapper").addClass("openerror");
      $("section.confirm-public-clone-modal").removeClass("inactive");
    }

    /**
     * Show the form for editing the brew note.
     */
    function showEditNote(noteId) {
      noteId = noteId.toString();
      $("div.note-view" + noteId).addClass("hidden");
      $("article.edit-note" + noteId).removeClass("hidden");
    }

    /**
     * Show icon for editing brew note (only shows up on logged-in user's brew
     * notes).
     */
    function showNoteIcons(noteId) {
      $(".note-icons").filter($("."+ noteId)).toggleClass("hidden");
    }

    ////////////////////////////////////////////////////////////////////////////
    // ROOTSCOPE FUNCTIONS ////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Create a clone of this recipe.
     */
    function clonePublicRecipe() {
      // First, close the confirmation modal
      $(".wrapper").removeClass("openerror");
      $("section.confirm-public-clone-modal").addClass("inactive");

      var cloneData = {};
      cloneData.title = vm.detail.title;
      cloneData.bean_name = vm.detail.bean_name;
      cloneData.roast = vm.detail.roast;
      cloneData.orientation = vm.detail.orientation;
      cloneData.general_recipe_comment = vm.detail.general_recipe_comment;
      cloneData.grind = vm.detail.grind;
      cloneData.total_bean_amount = vm.detail.total_bean_amount;
      cloneData.bean_units = vm.detail.bean_units;
      cloneData.water_type = vm.detail.water_type;
      cloneData.total_water_amount = vm.detail.total_water_amount;
      cloneData.water_units = vm.detail.water_units;
      cloneData.temp = vm.detail.temp;
      cloneData.steps = [];

      var newRecipeId = null;
      var recipesUrl = '/api/users/' + $rootScope.username + '/recipes/';
      dataService.post(recipesUrl, cloneData)
        .success(function(response) {
          newRecipeId = response.id;
          var steps = [];
          for (var step in vm.detail.steps) {
            steps[step] = {};
            steps[step].step_number = vm.detail.steps[step].step_number;
            steps[step].step_title = vm.detail.steps[step].step_title;
            steps[step].step_body = vm.detail.steps[step].step_body;
            steps[step].duration = vm.detail.steps[step].duration;
            steps[step].water_amount = vm.detail.steps[step].water_amount;

            // Post a copy of this step to the new recipe
            dataService.post(recipesUrl + newRecipeId + '/steps/', steps[step]);
          }
        })
        .then(function() {
          // Redirect to the clone editor
          $location.path('/' + $rootScope.username + '/clone/' + newRecipeId);
        });
    }
  }
})();
