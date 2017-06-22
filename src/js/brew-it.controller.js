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
    vm.reStartBrew = reStartBrew;
    vm.resetBrew = resetBrew;
    vm.showStars = false;
    vm.startBrew = startBrew;
    vm.username = $routeParams.username;

    ////////////////////////////////////////////////////////////////////////////
    // INITIALIZATION /////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    var timerRunning = false;
    var recipeUrl = $rootScope.baseUrl + '/api/users/' + $routeParams.username + '/recipes/' + $routeParams.id + '/';
    var brewNoteUrl = recipeUrl + 'brewnotes/';

    initialize();
    initBrewNoteListeners();

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Add a brew note to the recipe.
     */
    function addBrewNote() {
      $http.post(brewNoteUrl, vm.brewnote);
      // Prepare for adding another brew note
      vm.brewnote = {};
    }

    /**
     * Initialize listeners required for adding a brew note.
     */
    function initBrewNoteListeners() {
      // Prepare to enter text into the brew note form
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
     * Gather the required data for this page.
     */
    function initialize() {
      $(document).scrollTop(0);
      $http.get(recipeUrl)
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
    }

    /**
     * Advance the running brew timer to the next step.
     *
     * @param {number} stepNumber The current step number.
     * @param {number} brewCount How many times this recipe has been brewed.
     */
    function nextStep(stepNumber, brewCount) {
      var nextStepIndex = vm.stepArray.indexOf(stepNumber) + 1;
      var nextStep = vm.stepArray[nextStepIndex];
      var prevStep = vm.stepArray[nextStepIndex - 2];
      var nextTimerId = vm.stepArray.indexOf(stepNumber) + 2;
      if (nextStepIndex >= vm.steps.length) {
        // End of brew countdown
        vm.resetBrew();
        // Update brew_count
        var recipe = {};
        recipe.brew_count = brewCount + 1;

        // TODO: Once we are no longer re-acquiring the recipe on reset, make
        // sure we handle brewCount properly. The below increment was commented
        // out in the original.

        // brewCount++;

        // Update the database with the new brew count
        $http.patch(recipeUrl, recipe);
        return;
      }
      $("timer."+stepNumber).addClass("hidden");// Hide last step
      $("."+stepNumber).addClass("finished").removeClass("current-step");// Hide last step
      // Change next step to green and grow next step to 200
      $("timer."+nextStep).removeClass("hidden");
      $("."+nextStep).addClass("current-step").removeClass("inactive-step");

      $('timer')[nextTimerId].start();
    }

    /**
     * Update the recipe with a new rating.
     */
    function rateRecipe(rating, id) {
      var newRating = {"rating": rating};
      $http.patch(recipeUrl, newRating);
    }

    /**
     * Restart the brew timer, linked to the "Restart Brew" button.
     */
    function reStartBrew() {
      if(timerRunning){
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
      $('timer')[0].start();
      vm.showStars = false;
    }

    /**
     * Reset when a timer is already running (to a non-running timer).
     */
    function resetBrew() {
      $(".current-step").addClass("hidden");
      $("timer.counter").addClass("hidden");
      $(".delay.hidden").removeClass("hidden");
      $(".current-step").removeClass("current-step");
      $(".countdown").removeClass("hidden");
      $("div.countdown").addClass("hidden");
      $(".time-" + vm.countdownVal).removeClass("timeline");//timeline
      $scope.$broadcast('timer-reset');
      $("a[href].restart-brew").removeClass("hidden");
      $("a[href].add-brew-note").removeClass("hidden");
      $("a[href].reset-brew").addClass("hidden");
      vm.showStars = true;
      timerRunning = false;

      // FIXME: Getting the data again solves the timers not resetting
      // correctly, but we should not make a needless API call!
      $http.get(recipeUrl)
        .then(function(response){
          vm.detail = response.data;
          vm.steps = response.data.steps;
          vm.notes = response.data.brewnotes;
          vm.countdownVal = response.data.total_duration;
        });
    }

    /**
     * Start the brew timer.
     */
    function startBrew() {
      if (timerRunning) {
        return;
      }
      $("." + vm.stepArray[0]).removeClass("inactive-step").addClass("current-step");
      $("div.delay").addClass("hidden").addClass("inactive-step");
      $(".delay timer").addClass("hidden");
      $(".time-" + vm.countdownVal).addClass("timeline");  //timeline
      $("timer." + vm.stepArray[0]).removeClass("hidden");  //Show's timer for active step
      $('timer')[1].start();
      timerRunning = true;
    }
  }
})();
