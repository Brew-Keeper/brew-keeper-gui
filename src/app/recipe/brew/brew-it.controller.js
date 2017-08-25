(function() {  //IIFE
  'use strict';

  angular
    .module('app.recipe.brew')
    .controller('BrewItController', BrewItController);

  BrewItController.$inject = [
    '$location',
    '$rootScope',
    '$routeParams',
    '$scope',
    'dataService',
    'recipePrep'
  ];

  function BrewItController(
      $location,
      $rootScope,
      $routeParams,
      $scope,
      dataService,
      recipePrep
  ) {
    var vm = this;
    vm.addBrewNote = addBrewNote;
    vm.brewnote = {};
    vm.countdownVal = null;
    vm.detail = {};
    vm.isPublic = ($location.path().indexOf('/public') === 0);
    vm.nextStep = nextStep;
    vm.notes = {};
    vm.ratePublicRecipe = ratePublicRecipe;
    vm.rateRecipe = rateRecipe;
    vm.ratingId = null;
    vm.ratings = null;
    vm.recipeUsername = vm.isPublic ? 'public' : $rootScope.username;
    vm.resetBrew = resetBrew;
    vm.restartBrew = restartBrew;
    vm.showStars = false;
    vm.startBrew = startBrew;
    vm.stepArray = [];
    vm.stepTotal = null;
    vm.steps = {};
    vm.timerRunning = false;
    vm.userRating = null;

    var brewNoteUrl = null;
    var recipeUrl = null;
    var ratingsUrl = null;

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      if (vm.isPublic) {
        recipeUrl = '/api/users/public/recipes/' + $routeParams.id + '/';
        ratingsUrl = recipeUrl + 'ratings/';
      } else {
        recipeUrl = '/api/users/' + $rootScope.username + '/recipes/' +
          $routeParams.id + '/';
        brewNoteUrl = recipeUrl + 'brewnotes/';
      }

      $(document).scrollTop(0);

      vm.recipe = recipePrep;
      setSemanticVariables(vm.recipe);

      if (vm.isPublic && $rootScope.username) {
        getPublicRatings();
      }

      // Show brew note form on add note
      $(".add-brew-note").on('click', function() {
        $(".brew-form").toggleClass("hidden");
        $('.input-focus').focus();
      });

      function hideBrewNoteForm() {
        $(".brew-form").addClass("hidden");
      }

      // Hide brew note form on submit
      $(".save-note").on('click', hideBrewNoteForm);

      // Hide brew note form on cancel
      $(".cancel-note").on('click', hideBrewNoteForm);

      // Set the timeline duration variable
      document.documentElement.style.setProperty(
        '--brew-duration',
        vm.recipe.total_duration + 's');
    }

    /**
     * Add a brew note to the recipe.
     */
    function addBrewNote() {
      dataService.post(brewNoteUrl, vm.brewnote);
      // Prepare for adding another brew note
      vm.brewnote = {};
    }

    /**
     * Get and set the public rating associated with a public recipe.
     */
    function getPublicRatings() {
      dataService.get(ratingsUrl)
        .then(function(response) {
          var publicRatings = response.data;
          for (var i = 0; i < publicRatings.length; i++) {
            if (publicRatings[i].username == $rootScope.username) {
              vm.ratingId = publicRatings[i].id;
              vm.userRating = publicRatings[i].public_rating;
              break;
            }
          }
          vm.ratings = [{current: vm.userRating}];
        });
    }

    /**
     * Advance the running brew timer to the next step.
     *
     * @param {number} stepNumber The current step number.
     */
    function nextStep(stepNumber) {
      var nextStepIndex = vm.stepArray.indexOf(stepNumber) + 1;
      var nextStep = vm.stepArray[nextStepIndex];
      var nextTimerId = vm.stepArray.indexOf(stepNumber) + 2;

      if (nextStepIndex >= vm.steps.length) {
        // End of brew countdown
        vm.resetBrew();

        // If this is a public recipe, we're done here
        if (vm.isPublic) {
          return;
        }

        // Update brew_count
        var recipe = {};
        vm.detail.brew_count += 1;
        recipe.brew_count = vm.detail.brew_count;

        // Update the database with the new brew count
        dataService.patch(recipeUrl, recipe);

        return;
      }

      // Hide this step
      $("timer." + stepNumber).addClass("hidden");
      $("." + stepNumber).addClass("brew-step--finished").removeClass("brew-step--current");

      // Change next step to green and grow next step to 200
      $("timer." + nextStep).removeClass("hidden");
      $("." + nextStep).addClass("brew-step--current").removeClass("brew-step--inactive");

      // Start the next step's timer
      $scope.$broadcast('startTimer', nextTimerId);
    }

    /**
     * Rate this public recipe.
     *
     * @param {number} rating The new user rating of this public recipe.
     */
    function ratePublicRecipe(rating) {
      var newRating = {"public_rating": rating};
      vm.userRating = rating;
      vm.ratings = [{current: vm.userRating}];

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
     * Update the recipe with a new rating.
     *
     * @param {number} rating The new rating of the recipe.
     */
    function rateRecipe(rating) {
      var newRating = {"rating": rating};
      dataService.patch(recipeUrl, newRating);
    }

    /**
     * Restart the brew timer (linked to the "Restart Brew" button).
     */
    function restartBrew() {
      // Cannot restart if a timer is already running
      if (vm.timerRunning) {
        return;
      }

      // Hide stars, "Add Note", brew note form, and "Restart Brew"
      vm.showStars = false;
      $("a[href].add-brew-note").addClass("hidden");
      $(".brew-form").addClass("hidden");
      $(".brew-step--restart").addClass("hidden");

      // Hide the timeline (hidden during countdown)
      $(".time-" + vm.countdownVal).removeClass("timeline");

      // Show the "RESET" button
      $("a[href].reset-brew").removeClass("hidden");

      // Reset all steps to be inactive
      $(".brew-step").addClass("brew-step--inactive");

      // Show the countdown step and its timer
      $(".brew-step--countdown").removeClass("brew-step--inactive");
      $(".brew-step--countdown").removeClass("hidden");
      $("timer.delay").removeClass("hidden");

      // Start the countdown timer
      $scope.$broadcast('startTimer', 'countdown');
    }

    /**
     * Reset when a timer is already running (to a non-running timer).
     */
    function resetBrew() {
      // Have all of the timers reset
      $scope.$broadcast('resetTimer');

      $("timer").addClass("hidden");

      // Reset any completed steps back to inactive
      $(".brew-step--finished").addClass("brew-step--inactive");
      $(".brew-step--finished").removeClass("brew-step--finished");

      // Reset the current step
      $(".brew-step--current").addClass("brew-step--inactive");
      $(".brew-step--current").removeClass("brew-step--current");

      // Make sure the reset step is not flagged as inactive
      $(".brew-step--restart").removeClass("brew-step--inactive");
      $(".countdown").removeClass("hidden");
      $(".brew-step--countdown").addClass("hidden");

      // Hide the timeline
      $(".time-" + vm.countdownVal).removeClass("timeline");

      // Show "Restart Brew" and "Add Note", hide "Reset"
      $(".brew-step--restart").removeClass("hidden");
      $("a[href].add-brew-note").removeClass("hidden");
      $("a[href].reset-brew").addClass("hidden");
      vm.showStars = true;
    }

    /**
     * Set semantic variables to make them easier to access.
     *
     * @param {Object} recipe The full recipe.
     */
    function setSemanticVariables(recipe) {
      vm.detail = recipe;
      var currentRating = vm.isPublic ? vm.detail.average_rating : vm.detail.rating;
      vm.ratings = [{current: currentRating}];
      vm.steps = recipe.steps;
      vm.notes = recipe.brewnotes;
      vm.countdownVal = recipe.total_duration;
      var stepArray = []; //create an array of step #'s'
      for (var step in vm.steps) {
        stepArray.push(vm.steps[step].step_number);
      }
      vm.stepArray = stepArray;
      vm.stepTotal = stepArray.length;
    }

    /**
     * Start the brew timer (called when countdown timer completes).
     */
    function startBrew() {
      // Set the first step to be current-step and show its timer
      $("." + vm.stepArray[0])
        .removeClass("brew-step--inactive")
        .addClass("brew-step--current");
      $("timer." + vm.stepArray[0]).removeClass("hidden");

      // Hide and shrink the countdown step
      $(".brew-step--countdown").addClass("hidden").addClass("brew-step--inactive");

      // Show the timeline
      $(".time-" + vm.countdownVal).addClass("timeline");

      // Start the timer
      $scope.$broadcast('startTimer', 1);
    }
  }
})();
