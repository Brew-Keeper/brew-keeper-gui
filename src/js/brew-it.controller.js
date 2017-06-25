;(function() {  //IIFE
  'use strict';

  angular
    .module('brewKeeper')
    .controller('BrewIt', BrewIt);

  BrewIt.$inject = ['$scope', '$http', '$routeParams', '$rootScope'];
  
  function BrewIt($scope, $http, $routeParams, $rootScope) {
    var vm = this;
    vm.addBrewNote = addBrewNote;
    vm.brewnote = {};
    vm.nextStep = nextStep;
    vm.rateRecipe = rateRecipe;
    vm.restartBrew = restartBrew;
    vm.resetBrew = resetBrew;
    vm.showStars = false;
    vm.startBrew = startBrew;
    vm.username = $routeParams.username;

    ////////////////////////////////////////////////////////////////////////////
    // INITIALIZATION /////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    activate();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Prepare the page.
     */
    function activate() {
      vm.recipeUrl = $rootScope.baseUrl + '/api/users/' + $routeParams.username + '/recipes/' + $routeParams.id + '/';
      vm.brewNoteUrl = vm.recipeUrl + 'brewnotes/';
      vm.timerRunning = false;

      $(document).scrollTop(0);
      $http.get(vm.recipeUrl)
        .then(function(response) {
          vm.detail = response.data;
          vm.steps = response.data.steps;
          vm.notes = response.data.brewnotes;
          vm.countdownVal = response.data.total_duration;
          vm.ratings = [{
              max: 5
          }];
          var stepArray = []; //create an array of step #'s'
          for(var step in vm.steps){
            stepArray.push(vm.steps[step].step_number);
          }
          vm.stepArray = stepArray;
          vm.stepTotal = stepArray.length;
        });

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
    }

    /**
     * Add a brew note to the recipe.
     */
    function addBrewNote() {
      $http.post(vm.brewNoteUrl, vm.brewnote);
      // Prepare for adding another brew note
      vm.brewnote = {};
    }

    /**
     * Advance the running brew timer to the next step.
     *
     * @param {number} stepNumber The current step number.
     */
    function nextStep(stepNumber) {
      var nextStepIndex = vm.stepArray.indexOf(stepNumber) + 1;
      var nextStep = vm.stepArray[nextStepIndex];
      var prevStep = vm.stepArray[nextStepIndex - 2];
      var nextTimerId = vm.stepArray.indexOf(stepNumber) + 2;
      if (nextStepIndex >= vm.steps.length) {
        // End of brew countdown
        vm.resetBrew();
        // Update brew_count
        var recipe = {};
        vm.detail.brew_count += 1;
        recipe.brew_count = vm.detail.brew_count;

        // Update the database with the new brew count
        $http.patch(vm.recipeUrl, recipe);
        return;
      }
      $("timer."+stepNumber).addClass("hidden");  // Hide last step
      $("."+stepNumber).addClass("finished").removeClass("current-step");  // Hide last step
      // Change next step to green and grow next step to 200
      $("timer."+nextStep).removeClass("hidden");
      $("."+nextStep).addClass("current-step").removeClass("inactive-step");

      // Start the next step's timer
      $scope.$broadcast('startTimer', nextTimerId);
    }

    /**
     * Update the recipe with a new rating.
     */
    function rateRecipe(rating, id) {
      var newRating = {"rating": rating};
      $http.patch(vm.recipeUrl, newRating);
    }

    /**
     * Restart the brew timer (linked to the "Restart Brew" button).
     */
    function restartBrew() {
      // Cannot restart if a timer is already running
      if (vm.timerRunning) {
        return;
      }
      $(".countdown").removeClass("hidden");
      $(".brew-form").addClass("hidden");
      $("div.restart").addClass("hidden");
      $(".countdown").removeClass("hidden");
      $("timer.delay").removeClass("hidden");
      $(".step").addClass("inactive-step");
      $("a[href].restart-brew").addClass("hidden");
      $("a[href].add-brew-note").addClass("hidden");
      $("a[href].reset-brew").removeClass("hidden");
      $(".time-" + vm.countdownVal).removeClass("timeline");//timeline
      $scope.$broadcast('startTimer', 'countdown');
      vm.showStars = false;
    }

    /**
     * Reset when a timer is already running (to a non-running timer).
     */
    function resetBrew() {
      // Have all of the timers reset
      $scope.$broadcast('resetTimer');

      $("timer.counting").addClass("hidden");

      // Reset any completed steps back to inactive
      $(".finished").addClass("inactive-step");
      $(".finished").removeClass("finished");

      // Reset the current step
      $(".current-step").addClass("inactive-step");
      $(".current-step").removeClass("current-step");

      // Ensure our delay steps are hidden
      $(".delay.hidden").removeClass("hidden");
      $(".countdown").removeClass("hidden");
      $("div.countdown").addClass("hidden");

      // Hide the timeline
      $(".time-" + vm.countdownVal).removeClass("timeline");

      // Show "Restart Brew" and "Add Note", hide "Reset"
      $("a[href].restart-brew").removeClass("hidden");
      $("a[href].add-brew-note").removeClass("hidden");
      $("a[href].reset-brew").addClass("hidden");
      vm.showStars = true;
    }

    /**
     * Start the brew timer.
     */
    function startBrew() {
      // Initialize the timers property now that the page is fully loaded
      vm.timers = $('timer').find().prevObject;

      $("." + vm.stepArray[0]).removeClass("inactive-step").addClass("current-step");
      $("div.delay").addClass("hidden").addClass("inactive-step");
      $(".delay timer").addClass("hidden");
      $(".time-" + vm.countdownVal).addClass("timeline");  // timeline
      $("timer." + vm.stepArray[0]).removeClass("hidden");  // Shows timer for active step
      $scope.$broadcast('startTimer', 1);
    }
  }
})();
