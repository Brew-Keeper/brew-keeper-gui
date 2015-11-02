;(function(){//IFEE

angular.module('brewKeeper')
    .controller('createNewRecipe', function($scope, $http){
      $scope.recipe = { }//Might need to prepopulate this with empty strings for each key... Maybe...
      $scope.submit=function(){
        $http.post('urlendpoint', $scope.recipe);//ADD ACTUAL ENDPOINT HERE!
      $scope.recipe= { };
    }
    });

})();//END IFEE
