;(function(){ //IIFE for angular

  angular.module('brewKeeper', ['ngRoute', 'timer', 'ngCookies'], function($httpProvider, $routeProvider){
      $routeProvider
        .when('/',{
          templateUrl: 'partials/recipe-list.html',
          controller: 'WhoAmIController'
          // redirectTo: '/users/shay'
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

    .controller('MainController', function($http, $scope, $route, $routeParams, $location, $cookies){
      var cookie = $cookies.get("Authorization")

      $http.defaults.headers.common = {"Authorization": cookie}
      $scope.$route = $route;
      $scope.$location = $location;
      $scope.$routeParams = $routeParams;
    })

    .controller('WhoAmIController', function($location, $http) {
      $http.get('https://brew-keeper-api.herokuapp.com/api/whoami/')
        .then(function(response){
          var username = response.data.username;
          $location.path('/users/' + username)
          console.log("FIRE AWAY!")
      })
    })


})(); //end IIFE
