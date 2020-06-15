(function() {
  'use strict';

  angular
    .module('app.recipe.brew')
    .controller('StepTimerController', StepTimerController);

  StepTimerController.$inject = ['$scope'];

  function StepTimerController($scope) {
    var stepVm = this;
    stepVm.initTimer = initTimer;
    stepVm.resetTimer = resetTimer;
    stepVm.startTimer = startTimer;

    ////////////////////////////////////////////////////////////////////////////
    // LISTENERS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    $scope.$on('resetTimer', resetTimer);

    $scope.$on('startTimer', startTimer);

    ////////////////////////////////////////////////////////////////////////////
    // FUNCTIONS //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /**
     * Initialize the timer. Resetting a timer subtracts one second from its
     * intended total time, so we start by resetting it. This way, we will have
     * consistent durations after subsequent resets.
     *
     * @param {(number|string)} stepId The unique identifier for the timer's step.
     */
    function initTimer(stepId) {
      stepVm.stepId = stepId;
      $scope.$broadcast('timer-reset');

      // The countdown timer auto-starts on page load
      if (stepId === 'countdown') {
        $scope.$broadcast('timer-start');
      }
    }

    /**
     * Stop, then reset the timer.
     *
     * @param {Object} e The event context of an incoming signal.
     */
    function resetTimer(e) {
      $scope.$broadcast('timer-stop');
      $scope.$broadcast('timer-reset');
      e.targetScope.vm.timerRunning = false;
    }

    /**
     * Start the timer.
     *
     * @param {Object} e The event context of an incoming signal.
     * @param {(number|string)} stepId The step ID this is meant to effect.
     */
    function startTimer(e, stepId) {
      if (stepVm.stepId === stepId) {
        $scope.$broadcast('timer-start');
        e.targetScope.vm.timerRunning = true;
      }
    }
  }
})();
