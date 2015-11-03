;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeDetail', function($scope, $http, $routeParams){
          // console.log("firing the recipeDetail controller")
          var id = $routeParams.id;
          var username = $routeParams.username;
          $http.get('https://brew-keeper-api.herokuapp.com/api/users/' + username + '/recipes/' + id)
            .then(function(response){
              $scope.detail = response.data;
              $scope.steps = response.data.steps;
              $scope.notes = response.data.brewnotes;
            })
          $scope.showSteps = function(stepId){
            stepId= "p." + stepId.toString()
            $(stepId).toggleClass("hidden")
          };
          $scope.showNotes = function(){
            $("div.notes").toggleClass("hidden")
          };
      })


})();//END Angular IFEE
