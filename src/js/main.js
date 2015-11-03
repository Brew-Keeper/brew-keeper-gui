;(function(){ //IIFE for angular

  angular.module('brewKeeper', ['ngRoute'], function($routeProvider){
      $routeProvider
        .when('/',{
          templateUrl: 'partials/recipe-list.html',
          controller: 'recipeList'
        })
        .when('/recipe/new', {
          templateUrl: 'partials/recipe-create.html'
        })
        .when('/recipe/brew/:id', {
          templateUrl: 'partials/brew-it.html',
          controller: 'brewIt'
        })
        .when('/recipe/:id', {
          templateUrl: 'partials/recipe-detail.html',
          controller: 'recipeDetail'
        })
        .when('/info', {
          templateUrl: 'partials/more-info.html'
        })
        .when('/login', {
          templateUrl: 'partials/login.html'
        })
        .otherwise({
          redirectTo: '/404.html',
          templateUrl: 'partials/404.html'
        })
    })

    .controller('MainController', function($scope, $route, $routeParams, $location){
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    })


})(); //end IIFE



// ;(function(){ //IIFE for angular
//
//   angular.module('brewKeeper', ['ngRoute'], function($routeProvider){
//       $routeProvider
//         .when('/',{
//           templateUrl: 'partials/recipe-list.html'
//         })
//         .when('/recipe', {
//           templateUrl: 'partials/recipe-detail.html'
//         })
//         .when('/recipe/new', {
//           templateUrl: 'partials/recipe-create.html'
//         })
//         .when('/recipe/brew', {
//           templateUrl: 'partials/brew-it.html'
//         })
//         .when('/info', {
//           templateUrl: 'partials/more-info.html'
//         })
//         .otherwise({
//           redirectTo: '/404.html',
//           templateUrl: 'partials/404.html'
//         })
//     });
//
//
// })(); //end IIFE
