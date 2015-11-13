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
        $location.path("/users/"+ $rootScope.username +"/clone/"+ newRecipeId);
      })//end post new recipe
    }; //end recipe clone function



  }) //end recipDetail controller
})();//END Angular IFEE
