;(function(){//IFEE

angular.module('brewKeeper')
      .controller('recipeList', function($scope, $http){
          $http.get('api/users/1/user1.json')
            .then(function(response){
              $scope.recipes = response.data.recipe_list;
            })
      })


})();//END IFEE
