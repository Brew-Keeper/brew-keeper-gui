;(function() {  // IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('PublicDetailController', PublicDetailController);

  PublicDetailController.$inject = [
    '$location',
    '$rootScope',
    '$routeParams',
    'dataService',
    'recipePrep'
  ];

  function PublicDetailController(
      $location,
      $rootScope,
      $routeParams,
      dataService,
      recipePrep
  ) {
    $rootScope.clonePublicRecipe = clonePublicRecipe;

    var vm = this;
    vm.addBrewNote = addBrewNote;
    vm.deleteComment = deleteComment;
    vm.detail = {};
    vm.editComment = editComment;
    vm.rateRecipe = rateRecipe;
    vm.ratingId = null;
    vm.ratings = {};
    vm.showAddBrewNote = showAddBrewNote;
    vm.showCloneRecipe = showCloneRecipe;
    vm.showEditNote = showEditNote;
    vm.showNoteIcons = showNoteIcons;
    vm.userRatings = null;

    var recipeUrl = '/api/users/public/recipes/' + $routeParams.id + '/';
    var ratingsUrl = recipeUrl + 'ratings/';
    var commentsUrl = recipeUrl + 'comments/';

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    function activate() {
      $(document).scrollTop(0);

      vm.detail = recipePrep;
      vm.ratingId = vm.detail.public_ratings.id;
      if (vm.ratingId !== undefined) {
        vm.userRatings = [{current: vm.detail.public_ratings.public_rating}];
      }
      vm.ratings = [{current: vm.detail.average_rating}];

      addListeners();
    }

    /**
     * Add a public brew note.
     */
    function addBrewNote() {
      dataService.post(commentsUrl, vm.comment)
        .success(function (data) {
          vm.detail.public_comments.unshift(data);

          // Close the brew note form
          $(".brew-form").toggleClass("hidden");
        });

      // Reset the brew note form data
      vm.comment = {};
    }

    /**
     * Add the listeners needed for this controller.
     */
    function addListeners() {
      // Close the public clone modal if user cancels
      $("#public-clone-cancel-btn").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("#public-clone-modal").addClass("inactive");
        return;
      });
    }

    /**
     * Delete the logged-in user's comment from this public recipe.
     */
    function deleteComment(commentId) {
      // Remove the comment from the model
      for (var i = 0; i < vm.detail.public_comments.length; i++) {
        if (vm.detail.public_comments[i].id == commentId) {
          vm.detail.public_comments.splice(i, 1);
          break;
        }
      }

      // Remove the comment in the db
      dataService.delete(commentsUrl + commentId + '/');
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
      vm.userRatings = [{current: rating}];

      // If the user has already rated, update their current rating
      if (vm.ratingId) {
        // Update the rating in the model
        vm.detail.public_ratings.public_rating = rating;

        // Update the public rating in the db
        dataService.patch(ratingsUrl + vm.ratingId + '/', newRating);
      }

      // If the user has not rated, create new rating
      if (!vm.ratingId) {
        dataService.post(recipeUrl + 'ratings/', newRating)
          .then(function(response) {
            vm.ratingId = response.data.id;
            vm.detail.public_ratings = response.data;
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
      $("#public-clone-modal").removeClass("inactive");
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
      $(".note-icons").filter($("." + noteId)).toggleClass("hidden");
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
      $("#public-clone-modal").addClass("inactive");

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
          $location.path('/users/' + $rootScope.username + '/clone/' + newRecipeId);
        });
    }
  }
})();
