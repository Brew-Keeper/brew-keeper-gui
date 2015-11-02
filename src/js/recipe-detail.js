;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeDetail', function($scope, $http, $routeParams){
          var id = $routeParams.id;
          $http.get('api/users/1/recipes/'+ id + '/recipe.json')
            .then(function(response){
              $scope.detail = response.data;
              $scope.steps = response.data.steps;
              $scope.notes = response.data.brewnotes;
            })
      })

})();//END Angular IFEE

;(function(){// JQuery IFEE
  // console.log($(".show-steps"));
  $(".test").click(function(){
    console.log("tracer");
    // $("div.steps").toggleClass("hide");
  });

})();//END JQuery IFEE
