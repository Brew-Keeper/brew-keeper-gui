;(function() {  //IIFE
  'use strict';

  angular
    .module('brewKeeper')
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
     * Record the step to which this timer belongs.
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
     */
    function resetTimer(e) {
      $scope.$broadcast('timer-stop');
      $scope.$broadcast('timer-reset');
      e.targetScope.vm.timerRunning = false;
    }

    /**
     * Start the timer.
     */
    function startTimer(e, intendedRecipient) {
      if (stepVm.stepId === intendedRecipient) {
        $scope.$broadcast('timer-start');
        e.targetScope.vm.timerRunning = true;
      }
    }
  }
})();
