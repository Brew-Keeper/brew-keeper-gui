;(function(){//IFEE

angular.module('brewKeeper')
  .controller('createNewRecipe', function($scope, $http){
    $scope.recipe = { }//Might need to prepopulate this with empty strings for each key... Maybe...
    $scope.submit=function(){
      $http.post('https://brew-keeper-api.herokuapp.com/api/users/don.pablo/recipes/', $scope.recipe)
        .then(function() {
        })
    $scope.recipe= { };
  }
  $('.addSteps').on('click', function() {
    $('.addSteps').removeClass('hidden');
  });//Reveal "Add Step" when new recipe form is submitted.
  })//controller for creating new recipe
  .controller('createNewStep', function($scope, $http){
    $scope.step = { }//Might need to prepopulate this with empty strings for each key... Maybe...
    $scope.submit=function(){
      $http.post('urlendpoint', $scope.step);//ADD ACTUAL ENDPOINT HERE!
      $scope.step= { };
    }
  })//controller for creating new step

})();//END IFEE

/* Eventually, it would be good to have the submitted form's information show up in place of the blank form so that the add new steps will be filled out instead of a new recipe form.  Then, as each step is added, it's info will show alongside the recipe info. */
