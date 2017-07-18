;(function() {  // IFEE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('RecipeDetailController', RecipeDetailController);

  RecipeDetailController.$inject = [
    '$location',
    '$rootScope',
    '$routeParams',
    'dataService',
    'recipePrep',
    'recipeService'
  ];

  function RecipeDetailController(
      $location,
      $rootScope,
      $routeParams,
      dataService,
      recipePrep,
      recipeService
  ) {
    $rootScope.cloneRecipe = cloneRecipe;
    $rootScope.deleteStep = deleteStep;
    $rootScope.makePublic = makePublic;

    var vm = this;
    vm.addBrewNote = addBrewNote;
    vm.addStep = addStep;
    vm.decreaseStep = decreaseStep;
    vm.deleteNote = deleteNote;
    vm.deleteRecipe = deleteRecipe;
    vm.detail = {};
    vm.editNote = editNote;
    vm.editRecipe = editRecipe;
    vm.editStep = editStep;
    vm.hideEditStep = hideEditStep;
    vm.increaseStep = increaseStep;
    vm.notes = [];
    vm.rateRecipe = rateRecipe;
    vm.ratings = [{max: $rootScope.maxStars}];
    vm.showAddBrewNote = showAddBrewNote;
    vm.showAddSteps = showAddSteps;
    vm.showCloneModal = showCloneModal;
    vm.showDeleteStep = showDeleteStep;
    vm.showEditNote = showEditNote;
    vm.showEditStep = showEditStep;
    vm.showMakePublic = showMakePublic;
    vm.showNoteIcons = showNoteIcons;
    vm.step = {};
    vm.steps = [];

    var brewNotesUrl = '';
    var recipeUrl = '';
    var recipesUrl = '';

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      $(document).scrollTop(0);

      recipesUrl = '/api/users/' + $rootScope.username + '/recipes/';
      recipeUrl = recipesUrl + $routeParams.id + '/';
      brewNotesUrl = recipeUrl + 'brewnotes/';

      vm.detail = recipePrep;
      vm.steps = vm.detail.steps;
      vm.notes = vm.detail.brewnotes;
      vm.ratings = [{current:vm.detail.rating}];

      // Show the edit form if user clicks edit
      $('.edit-button').on('click', function() {
        $('.edit-recipe').removeClass("hidden");
        $('.recipe-view').addClass("hidden");
        $('.input-focus').focus();
      });

      // Hide the edit form if user cancels
      $('.cancel-recipe-edit').on('click', function() {
        $('.recipe-view').removeClass("hidden");
        $('.edit-recipe').addClass("hidden");
      });

      // Handle click on Add Steps
      $(".no-steps").click(vm.showAddSteps);

      // Close the delete step modal if the user cancels
      $("button.cancel-delete-step-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        // Remove the deletion marker
        $(".to-delete").removeClass("to-delete");
        $("section.confirm-delete-step-modal").addClass("inactive");
        return;
      });

      // Close the clone modal if the user cancels
      $("button.cancel-clone-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-clone-modal").addClass("inactive");
        return;
      });

      // Close no-steps error modal (when attempting to make public)
      $("button.steps-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.steps-modal").addClass("inactive");
      });

      // Close modal after cancelling make public confirmation
      $("button.cancel-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-modal").addClass("inactive");
        return;
      });

      // Close the make public success modal
      $("button.sharing-not-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.sharing-modal").addClass("inactive");
      });
    }

    /**
     * Add a brew note to this recipe with the filled-out info.
     */
    function addBrewNote() {
      dataService.post(brewNotesUrl, vm.brewnote)
        .success(function (data) {
          // Add the new note to the top (beginning) of the notes
          vm.notes.unshift(data);

          // Update the recipe with the new note and re-cache it
          vm.detail.notes = vm.notes;
          recipeService.cacheRecipes(vm.detail);

          // Close the brew note form
          $(".brew-form").toggleClass("hidden");
        });

      // Reset the brew note form data
      vm.brewnote = {};
    }

    /**
     * Add a new step to the recipe.
     */
    function addStep() {
      vm.step.step_number = vm.steps.length + 1;
      vm.detail.total_duration += vm.step.duration;
      $('.input-focus').focus();
      dataService.post(recipeUrl + 'steps/', vm.step)
        .then(function(response) {
          // Update the steps
          vm.steps.push(response.data);

          // Update the recipe with the new step and re-cache it
          vm.detail.steps = vm.steps;
          recipeService.cacheRecipes(vm.detail);

          // Show the Brew It button, hide the Add Steps button
          $(".brew-it-button").removeClass("hidden");
          $(".no-steps").addClass("hidden");
        });
      vm.step = {};
    }

    /**
     * Move the selected step further up the order.
     */
    function decreaseStep(step) {
      // Make sure there is a preceding step
      if (step.step_number <= 1) {
        return;
      }
      // Swap the steps in the UI
      var swapStep = vm.steps[step.step_number - 1];
      vm.steps[step.step_number - 1] = vm.steps[step.step_number - 2];
      vm.steps[step.step_number - 2] = swapStep;

      // Update the step numbers
      vm.steps[step.step_number - 1].step_number += 1;
      step.step_number--;

      // Update the cached version
      vm.detail.steps = vm.steps;
      recipeService.cacheRecipes(vm.detail);

      // Update the step in the API
      dataService.patch(recipeUrl + 'steps/' + step.id + '/', step);
    }

    /**
     * Delete the selected brew note.
     */
    function deleteNote(noteId) {
      // Remove the note from the model
      for (var i = 0; i < vm.notes.length; i++) {
        if (vm.notes[i].id == noteId) {
          vm.notes.splice(i, 1);
        }
      }

      // Update and cache the recipe
      vm.detail.brewnotes = vm.notes;
      recipeService.cacheRecipes(vm.detail);

      dataService.delete(brewNotesUrl + noteId + '/');
    }

    /**
     * Delete this recipe.
     */
    function deleteRecipe() {
      // Show modal to confirm action
      $(".wrapper").addClass("openerror");
      $("section.confirm-eliminate-modal").removeClass("inactive");
      // Hide modal if action cancelled
      $("button.cancel-clone-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-eliminate-modal").addClass("inactive");
        return;
      });
      // Hide modal, delete recipe, and return to recipe list upon confirmation
      $("button.confirm-eliminate-fail").on("click", function() {
        $(".wrapper").removeClass("openerror");
        $("section.confirm-eliminate-modal").addClass("inactive");
        dataService.delete(recipeUrl)
          .then(function() {
            $location.path('/' + $rootScope.username);
          });
      });
    }

    /**
     * Submit the edited brew note to the API.
     */
    function editNote(note) {
      var noteView = "div.note-view" + note.id.toString();
      var editNoteSelector = "article.edit-note" + note.id.toString();
      dataService.put(brewNotesUrl + note.id + '/', note)
        .then(function () {
          $(editNoteSelector).addClass("hidden");
          $(noteView).removeClass("hidden");
        });
    }

    /**
     * Submit the edited recipe to the API.
     */
    function editRecipe() {
      dataService.patch(recipeUrl, vm.detail)
        .then(function () {
          $('.edit-recipe').addClass("hidden");
          $('.recipe-view').removeClass("hidden");
        });
    }

    /**
     * Submit the edited step to the API.
     */
    function editStep(step) {
      dataService.patch(recipeUrl + 'steps/' + step.id + '/', step);
      // Recalculate the duration
      updateDuration();
    }

    /**
     * Hide the step-editing UI elements.
     */
    function hideEditStep(stepId) {
      stepId = stepId.toString();
      $("div." + stepId).toggleClass("hidden");
    }

    /**
     * Move the selected step further down the step order.
     */
    function increaseStep(step) {
      // Make sure there is a following step
      if (step.step_number >= vm.steps.length) {
        return;
      }
      // Swap the steps in the UI
      var swapStep = vm.steps[step.step_number - 1];
      vm.steps[step.step_number - 1] = vm.steps[step.step_number];
      vm.steps[step.step_number] = swapStep;

      // Update the step numbers
      vm.steps[step.step_number - 1].step_number -= 1;
      step.step_number++;

      // Update the cached version
      vm.detail.steps = vm.steps;
      recipeService.cacheRecipes(vm.detail);

      // Update the step in the API
      dataService.patch(recipeUrl + 'steps/' + step.id + '/', step);
    }

    /**
     * Rate this recipe.
     */
    function rateRecipe(rating) {
      var newRating = {"rating": rating};
      dataService.patch(recipeUrl, newRating);
    }

    /**
     * Show the button to add a brew note.
     */
    function showAddBrewNote() {
      $(".brew-form").toggleClass("hidden");
      $('.input-focus').focus();
    }

    /**
     * Reveal "Add Step" when new recipe form is submitted.
     */
    function showAddSteps() {
      $("form.create-new-step").toggleClass("hidden");
        $('.input-focus').focus();
    }

    /**
     * Show the confirm clone creation modal.
     */
    function showCloneModal() {
      $(".wrapper").addClass("openerror");
      $("section.confirm-clone-modal").removeClass("inactive");
    }

    /**
     * Delete the selected step.
     */
    function showDeleteStep(stepNumber) {
      // Show modal to confirm action
      $(".wrapper").addClass("openerror");
      $("section.confirm-delete-step-modal").removeClass("inactive");

      // Mark the specified step so we know which one to delete
      var stepIndex = stepNumber - 1;
      $("div.step-details").each(function(index) {
        if (index == stepIndex) {
          $(this).addClass("to-delete");
        }
      });
    }

    /**
     * Show form to edit brew note.
     */
    function showEditNote(noteId) {
      var noteView = "div.note-view" + noteId.toString();
      var editNoteSelector = "article.edit-note" + noteId.toString();
      $(noteView).addClass("hidden");
      $(editNoteSelector).removeClass("hidden");
    }

    /**
     * Show the step-editing UI components.
     */
    function showEditStep(stepId) {
      stepId = stepId.toString();
      $("div." + stepId).toggleClass("hidden");
    }

    /**
     * Make a copy of this recipe to appear in the public area.
     */
    function showMakePublic() {
      if (vm.steps.length < 1) {
        // Do not allow sharing recipes with no steps
        $(".wrapper").addClass("openerror");
        $("section.steps-modal").removeClass("inactive");
        return;
      }

      // Open make public confirmation
      $(".wrapper").addClass("openerror");
      $("section.confirm-modal").removeClass("inactive");
    }

    /**
     * Show the edit/delete icons for brew notes.
     */
    function showNoteIcons(noteId) {
      $(".note-icons").filter($("." + noteId)).toggleClass("hidden");
    }

    /**
     * Recalculate the duration and re-cache if it changed.
     */
    function updateDuration() {
      var newDuration = 0;
      for (var i = 0; i < vm.steps.length; i++) {
        newDuration += vm.steps[i].duration;
      }

      // If it changed, update and re-cache
      if (vm.detail.total_duration !== newDuration) {
        vm.detail.total_duration = newDuration;
        recipeService.cacheRecipes(vm.detail);
      }
    }

    ////////////////////////////////////////////////////////////////////////////
    // ROOTSCOPE FUNCTIONS ////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    // TODO: Fix the modals so these can be private!

    /**
     * Create a clone of this recipe.
     */
    function cloneRecipe() {
      // First, close the confirmation modal
      $(".wrapper").removeClass("openerror");
      $("section.confirm-clone-modal").addClass("inactive");

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

    /**
     * Delete the selected step.
     */
    function deleteStep() {
      var stepNumber = $(".to-delete").attr("data-step-number");
      $(".wrapper").removeClass("openerror");
      $("section.confirm-delete-step-modal").addClass("inactive");
      // Delete the step in the API
      var stepId = vm.steps[stepNumber - 1].id;
      dataService.delete(recipeUrl + 'steps/' + stepId + '/');

      // Remove the step
      vm.steps.splice(stepNumber - 1, 1);

      // If there were steps after it, adjust their step numbers
      if (vm.steps.length >= stepNumber && vm.steps.length > 0) {
        for (var i = stepNumber - 1; i < vm.steps.length; i++) {
          vm.steps[i].step_number -= 1;
        }
      }

      // Update the recipe with the new step array and re-cache it
      vm.detail.steps = vm.steps;
      recipeService.cacheRecipes(vm.detail);
      updateDuration();

      // Show "Add Steps" instead of "Brew It" if no steps remain
      if (vm.steps.length === 0) {
        $(".brew-it-button").addClass("hidden");
        $(".no-steps").removeClass("hidden");
      }
    }

    /**
     * Make a copy of this recipe to appear in the public area.
     */
    function makePublic() {
      // First, close the confirmation modal
      $("section.confirm-modal").addClass("inactive");

      // Gather the relevant data
      var publicData = {};
      publicData.title = vm.detail.title;
      publicData.bean_name = vm.detail.bean_name;
      publicData.roast = vm.detail.roast;
      publicData.orientation = vm.detail.orientation;
      publicData.general_recipe_comment = vm.detail.general_recipe_comment;
      publicData.grind = vm.detail.grind;
      publicData.total_bean_amount = vm.detail.total_bean_amount;
      publicData.bean_units = vm.detail.bean_units;
      publicData.water_type = vm.detail.water_type;
      publicData.total_water_amount = vm.detail.total_water_amount;
      publicData.water_units = vm.detail.water_units;
      publicData.temp = vm.detail.temp;
      publicData.shared_by = $rootScope.username;
      publicData.steps = [];

      dataService.post('/api/users/public/recipes/', publicData)
        .success(function(response) {
          var newRecipeId = response.id;

          // Now that we have the new recipe, add the steps
          var steps = []; //build the steps
          for (var step in vm.detail.steps) {
            steps[step] = {};
            steps[step].step_number = vm.detail.steps[step].step_number;
            steps[step].step_title = vm.detail.steps[step].step_title;
            steps[step].step_body = vm.detail.steps[step].step_body;
            steps[step].duration = vm.detail.steps[step].duration;
            steps[step].water_amount = vm.detail.steps[step].water_amount;

            dataService.post('/api/users/public/recipes/' + newRecipeId + '/steps/', steps[step]);
          }
        })
        .then(function() {
          $(".wrapper").addClass("openerror");
          $("section.sharing-modal").removeClass("inactive");
        });
    }
  }
})();
