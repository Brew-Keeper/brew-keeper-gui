;(function(){ //IIFE for angular

  angular.module('brewKeeper', ['ngRoute', 'timer'], function($httpProvider, $routeProvider){
      var userInfo = JSON.parse(window.sessionStorage["userInfo"])
      console.log(userInfo)
      // $httpProvider.defaults.headers.common = {"Authorization": "Token 17af9302daa37f79bfac3beb1266b5622b533984"}

      $httpProvider.defaults.headers.common = userInfo
      $routeProvider
        .when('/',{
          // templateUrl: 'partials/recipe-list.html',
          // controller: 'recipeList'
            redirectTo: '/users/don.pablo'
        })
        .when('/users/:username/recipes/new', {
          templateUrl: 'partials/recipe-create.html'
        })
        .when('/users/:username/recipes/:id', {
          templateUrl: 'partials/recipe-detail.html',
          controller: 'recipeDetail'
        })
        .when('/users/:username', {
          templateUrl: 'partials/recipe-list.html',
          controller: 'recipeList'
        })
        .when('/users/:username/recipes/:id/brewit', {
          templateUrl: 'partials/brew-it.html',
          controller: 'brewIt'
        })
        .when('/info', {
          templateUrl: 'partials/more-info.html'
        })
        .when('/login', {
          templateUrl: 'partials/login.html'
        })
        // .otherwise({
        //   redirectTo: '/404.html',
        //   templateUrl: 'partials/404.html'
        // })
    })

    .controller('MainController', function($scope, $route, $routeParams, $location, $window){
    var userInfo = JSON.parse($window.sessionStorage["userInfo"])
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
